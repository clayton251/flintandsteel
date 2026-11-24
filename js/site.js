(function () {
  "use strict";

  var REFRESH_MS = 60000;
  var round = 0;
  var active = null;
  var lastStarted = 0;

  function openMenu(toggle, mobile) {
    var willOpen = mobile.hasAttribute("hidden");
    if (willOpen) mobile.removeAttribute("hidden");
    else mobile.setAttribute("hidden", "");
    toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    toggle.textContent = willOpen ? "Close" : "Menu";
  }

  function closeMenu(toggle, mobile) {
    mobile.setAttribute("hidden", "");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
  }

  function fallbackCopy(value) {
    var field = document.createElement("textarea");
    field.className = "clipboard-sink";
    field.setAttribute("readonly", "readonly");
    field.value = value;
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    field.remove();
    return ok;
  }

  function copyText(text, button) {
    var value = String(text || "");
    var article = button.closest("article");
    var announce = article ? article.querySelector("[data-announce]") : null;
    var what = button.getAttribute("data-copy-what") || "text";
    function done(ok) {
      var previous = button.getAttribute("data-label") || button.textContent;
      button.setAttribute("data-label", previous);
      button.textContent = ok ? "Copied" : "Copy failed";
      if (announce) announce.textContent = ok ? "Copied " + what + "." : "Could not copy " + what + ".";
      window.setTimeout(function () {
        button.textContent = previous;
        if (announce) announce.textContent = "";
      }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function () { done(true); }, function () { done(fallbackCopy(value)); });
    } else {
      done(fallbackCopy(value));
    }
  }

  function minecraftStatusUrl(address) {
    if (typeof address !== "string") return "";
    var host = address.trim();
    if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(host)) return "";
    return "https://api.mcstatus.io/v2/status/java/" + encodeURIComponent(host);
  }

  function cleanCount(value) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
    return Math.min(Math.floor(value), 100000);
  }

  function cleanVersion(value) {
    if (typeof value !== "string") return "";
    var cleaned = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
    if (!cleaned) return "";
    return cleaned.length > 48 ? cleaned.slice(0, 47) + "…" : cleaned;
  }

  function cleanMap(value) {
    if (typeof value !== "string") return "";
    var cleaned = value.replace(/[^A-Za-z0-9_/ ,.-]/g, "").replace(/\s+/g, " ").trim();
    if (!cleaned) return "";
    return cleaned.slice(0, 32);
  }

  function readStatus(data) {
    if (!data || typeof data !== "object") return null;
    var players = data.players && typeof data.players === "object" ? data.players : {};
    var online = data.online === true ? true : data.online === false ? false : null;
    return {
      online: online,
      onlineCount: cleanCount(players.online),
      maxCount: cleanCount(players.max),
      version: cleanVersion(data.version && data.version.name_clean)
    };
  }

  function serversFromPage() {
    return Array.prototype.map.call(document.querySelectorAll("[data-server]"), function (card) {
      return {
        id: card.getAttribute("data-server") || "",
        game: card.getAttribute("data-game") || "",
        address: card.getAttribute("data-address") || "",
        addressConfirmed: card.getAttribute("data-confirmed") !== "false",
        card: card
      };
    });
  }

  function paintStatus(server, snapshot, failed) {
    var card = server.card;
    var status = card.querySelector("[data-status]");
    if (!status) return;
    var label = status.querySelector(".status-label");
    var meta = status.querySelector(".status-meta");
    status.classList.remove("is-checking", "is-online", "is-offline", "is-unknown", "is-unconfirmed");
    card.classList.remove("is-online", "is-offline");
    var parts = [];
    if (!failed && snapshot && snapshot.online === true) {
      status.classList.add("is-online");
      card.classList.add("is-online");
      label.textContent = "Online";
      if (snapshot.onlineCount != null && snapshot.maxCount != null) parts.push(snapshot.onlineCount + "/" + snapshot.maxCount + " players");
      else if (snapshot.onlineCount != null) parts.push(snapshot.onlineCount + " players");
      if (snapshot.version) parts.push(snapshot.version);
      if (snapshot.map) parts.push(snapshot.map);
      meta.textContent = parts.join(" · ") || "Server answered";
    } else if (!failed && snapshot && snapshot.online === false && server.addressConfirmed !== false) {
      status.classList.add("is-offline");
      card.classList.add("is-offline");
      label.textContent = "Offline";
      meta.textContent = "No player count while it is down";
    } else if (server.addressConfirmed === false && (failed || !snapshot || snapshot.online !== true)) {
      status.classList.add("is-unconfirmed");
      label.textContent = "Unconfirmed";
      meta.textContent = "Placeholder address, no status yet";
    } else {
      status.classList.add("is-unknown");
      label.textContent = "Unavailable";
      meta.textContent = "Status check did not answer";
    }
    if (status.getAttribute("data-announced") !== "1") {
      status.setAttribute("aria-live", "polite");
      status.setAttribute("data-announced", "1");
      window.setTimeout(function () { status.removeAttribute("aria-live"); }, 1500);
    }
  }

  var NETWORK_STATUS_URL = "https://status.flintandsteelnetwork.com/api/servers.json";

  function readNetworkEntry(entry) {
    if (!entry || typeof entry !== "object") return null;
    var online = entry.online === true ? true : entry.online === false ? false : null;
    if (online === null) return null;
    return {
      online: online,
      onlineCount: cleanCount(entry.players),
      maxCount: cleanCount(entry.max),
      version: "",
      map: cleanMap(typeof entry.map === "string" && entry.map ? entry.map : entry.world)
    };
  }

  function loadNetworkStatuses(servers, parentSignal, token) {
    if (!servers.length) return Promise.resolve();
    var ctrl = new AbortController();
    var timer = window.setTimeout(function () { ctrl.abort(); }, 8000);
    var onParent = function () { ctrl.abort(); };
    if (parentSignal) parentSignal.addEventListener("abort", onParent);
    return fetch(NETWORK_STATUS_URL, { signal: ctrl.signal, cache: "no-store", redirect: "error" })
      .then(function (res) {
        if (!res.ok) throw new Error("status");
        return res.json();
      })
      .then(function (data) {
        if (token !== round) return;
        var payload = data && typeof data === "object" ? data : {};
        servers.forEach(function (server) {
          if (!Object.prototype.hasOwnProperty.call(payload, server.id)) {
            paintStatus(server, null, true);
            return;
          }
          var snapshot = readNetworkEntry(payload[server.id]);
          if (!snapshot) paintStatus(server, null, true);
          else paintStatus(server, snapshot, false);
        });
      })
      .catch(function () {
        if (token !== round) return;
        servers.forEach(function (server) { paintStatus(server, null, true); });
      })
      .finally(function () {
        window.clearTimeout(timer);
        if (parentSignal) parentSignal.removeEventListener("abort", onParent);
      });
  }

  function loadStatus(server, parentSignal, token) {
    var url = minecraftStatusUrl(server.address);
    if (!/^[a-z0-9-]+$/.test(server.id)) return Promise.resolve();
    if (!url) {
      paintStatus(server, null, true);
      return Promise.resolve();
    }
    var ctrl = new AbortController();
    var timer = window.setTimeout(function () { ctrl.abort(); }, 8000);
    var onParent = function () { ctrl.abort(); };
    if (parentSignal) parentSignal.addEventListener("abort", onParent);
    return fetch(url, { signal: ctrl.signal, cache: "no-store", redirect: "error" })
      .then(function (res) {
        if (!res.ok) throw new Error("status");
        return res.json();
      })
      .then(function (data) {
        if (token !== round) return;
        paintStatus(server, readStatus(data), false);
      })
      .catch(function () {
        if (token !== round) return;
        paintStatus(server, null, true);
      })
      .finally(function () {
        window.clearTimeout(timer);
        if (parentSignal) parentSignal.removeEventListener("abort", onParent);
      });
  }

  function setChecked(text) {
    var node = document.getElementById("status-checked");
    if (node) node.textContent = text;
  }

  function refreshStatuses() {
    var token = ++round;
    if (active) active.abort();
    active = new AbortController();
    setChecked("Checking servers…");
    var listed = serversFromPage().filter(function (server) {
      return /^[a-z0-9-]+$/.test(server.id);
    });
    var jobs = listed.filter(function (server) {
      return server.game === "minecraft";
    }).map(function (server) {
      return loadStatus(server, active.signal, token);
    });
    jobs.push(loadNetworkStatuses(listed.filter(function (server) {
      return server.game !== "minecraft";
    }), active.signal, token));
    return Promise.all(jobs).then(function () {
      if (token !== round) return;
      var time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      setChecked("Updated " + time);
    });
  }

  function maybeRefresh(force) {
    var now = Date.now();
    if (!force && document.hidden) return;
    if (!force && now - lastStarted < REFRESH_MS) return;
    lastStarted = now;
    refreshStatuses();
  }

  function watchSections() {
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    if (!("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          var href = link.getAttribute("href") || "";
          if (link.getAttribute("aria-current") === "page" && href.charAt(0) !== "#") return;
          var on = href === "#" + entry.target.id;
          link.classList.toggle("is-current", on);
          if (on) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function init() {
    var toggle = document.querySelector(".nav-toggle");
    var mobile = document.getElementById("mobile-nav");
    if (toggle && mobile) {
      toggle.addEventListener("click", function () { openMenu(toggle, mobile); });
      mobile.addEventListener("click", function (event) {
        if (event.target.closest("a")) closeMenu(toggle, mobile);
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu(toggle, mobile);
      });
    }
    Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (button) {
      button.addEventListener("click", function () {
        copyText(button.getAttribute("data-copy"), button);
      });
    });
    var refresh = document.getElementById("refresh-status");
    if (refresh) refresh.addEventListener("click", function () { maybeRefresh(true); });
    watchSections();
    maybeRefresh(true);
    window.setInterval(function () { maybeRefresh(false); }, 5000);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) maybeRefresh(false);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
