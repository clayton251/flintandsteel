(function () {
  "use strict";

  var cfg = window.FNS_CONFIG;
  var app = document.getElementById("app");
  var REFRESH_MS = 60000;
  var round = 0;
  var active = null;
  var lastStarted = 0;

  function h(tag, props) {
    var node = document.createElement(tag);
    var kids = Array.prototype.slice.call(arguments, 2).flat();
    Object.keys(props || {}).forEach(function (key) {
      var value = props[key];
      if (value == null || value === false) return;
      if (key === "class") node.className = value;
      else if (key.slice(0, 2) === "on" && typeof value === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (value === true) node.setAttribute(key, "");
      else node.setAttribute(key, String(value));
    });
    kids.forEach(function (kid) {
      if (kid == null || kid === false) return;
      node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    });
    return node;
  }

  function logo(size) {
    return h("img", { src: "favicon.svg", alt: "", width: String(size), height: String(size) });
  }

  function addressCode(host) {
    var code = h("code", { class: "address" });
    String(host).split(".").forEach(function (part, index, all) {
      code.append(document.createTextNode(part));
      if (index < all.length - 1) {
        code.append(document.createTextNode("."));
        code.append(document.createElement("wbr"));
      }
    });
    return code;
  }

  function safeHttpUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      var url = new URL(value.trim());
      if (url.username || url.password) return "";
      if (url.protocol !== "https:" && url.protocol !== "http:") return "";
      return url.href;
    } catch (err) {
      return "";
    }
  }

  function external(href, className) {
    var url = safeHttpUrl(href);
    if (!url) return null;
    var kids = Array.prototype.slice.call(arguments, 2);
    kids.push(h("span", { class: "sr-only" }, " (opens in a new tab)"));
    return h.apply(null, ["a", {
      href: url,
      class: className,
      target: "_blank",
      rel: "noopener noreferrer",
      referrerpolicy: "no-referrer"
    }].concat(kids));
  }

  function discordLink(className, longLabel, shortLabel) {
    return external(cfg.discordUrl, className, h("span", { class: "long" }, longLabel), shortLabel ? h("span", { class: "short" }, shortLabel) : null);
  }

  function navLinks() {
    return [
      ["#servers", "Servers"],
      ["#join", "Join"],
      ["#ranks", "Ranks"],
      ["#rules", "Rules"],
      ["#vote", "Vote"]
    ].map(function (item) {
      return h("a", { href: item[0], class: "nav-link" }, item[1]);
    });
  }

  function renderHeader(openMenu) {
    var mobile = h("nav", {
      id: "mobile-nav",
      class: "nav-mobile",
      hidden: true,
      "aria-label": "Sections"
    }, navLinks());
    var toggle = h("button", {
      type: "button",
      class: "btn btn-steel nav-toggle",
      "aria-expanded": "false",
      "aria-controls": "mobile-nav",
      onClick: function () { openMenu(toggle, mobile); }
    }, "Menu");
    mobile.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu(toggle, mobile);
    });
    return h("header", { class: "site-header" },
      h("div", { class: "wrap header-inner" },
        h("a", { class: "brand", href: "#top" },
          logo(36),
          h("span", { class: "brand-name brand-name-long" }, "Flint & Steel"),
          h("span", { class: "brand-name brand-name-short" }, "F&S")
        ),
        h("nav", { class: "nav-desktop", "aria-label": "Sections" }, navLinks()),
        discordLink("btn btn-ember btn-discord", "Join Discord", "Discord"),
        toggle,
        mobile
      )
    );
  }

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

  function renderHero() {
    return h("section", { class: "hero", id: "top" },
      h("div", { class: "hero-copy" },
        h("p", { class: "kicker" }, "Veteran-run community"),
        h("h1", {},
          h("span", { class: "sr-only" }, cfg.name),
          h("span", { class: "lockup", "aria-hidden": "true" },
            h("span", {}, "Flint"),
            h("span", { class: "amp" }, "& Steel")
          )
        ),
        h("p", { class: "network", "aria-hidden": "true" }, "Network"),
        h("p", { class: "tagline" }, cfg.tagline),
        h("p", { class: "lede" }, cfg.lede),
        h("div", { class: "hero-actions" },
          discordLink("btn btn-ember", "Join Discord"),
          h("a", { class: "btn btn-steel", href: "#servers" }, "See the servers")
        ),
        h("div", { class: "heat", "aria-hidden": "true" },
          h("span", { class: "heat-label" }, "Forge lit"),
          h("span", { class: "heat-bar" }, h("span"))
        )
      ),
      h("div", { class: "hero-plate" },
        h("div", { class: "mark-wrap" },
          logo(220),
          h("div", { class: "embers", "aria-hidden": "true" },
            h("i"), h("i"), h("i"), h("i"), h("i"), h("i"), h("i"), h("i")
          )
        ),
        h("ul", { class: "hero-facts" },
          h("li", {}, "Minecraft and Valheim"),
          h("li", {}, "Discord whitelist"),
          h("li", {}, "Run by a veteran")
        )
      )
    );
  }

  function statusBox(server) {
    if (server.game !== "minecraft") {
      return h("p", { class: "status is-code" },
        h("span", { class: "lamp", "aria-hidden": "true" }),
        h("span", { class: "status-label" }, "Join with a code"),
        h("span", { class: "status-meta" }, "No Minecraft status check")
      );
    }
    return h("p", { class: "status is-checking", "data-status": "" },
      h("span", { class: "lamp", "aria-hidden": "true" }),
      h("span", { class: "status-label" }, "Checking"),
      h("span", { class: "status-meta" }, "Asking the server")
    );
  }

  function renderServer(server) {
    var actions = [];
    if (server.game === "valheim") {
      actions.push(h("button", {
        type: "button",
        class: "btn btn-steel btn-copy",
        onClick: function (event) { copyText(String(server.joinCode || ""), event.currentTarget, server.name + " join code"); }
      }, "Copy code"));
    } else if (server.address) {
      actions.push(h("button", {
        type: "button",
        class: "btn btn-steel btn-copy",
        onClick: function (event) { copyText(server.address, event.currentTarget, server.name + " address"); }
      }, "Copy address"));
    }
    if (server.mapUrl) {
      actions.push(external(server.mapUrl, "btn btn-steel", "Live map"));
    }

    return h("article", {
      class: "server-card" + (server.addressConfirmed === false ? " is-unconfirmed" : ""),
      "data-server": server.id,
      "data-game": server.game || ""
    },
      h("div", { class: "card-kicker" },
        h("span", { class: "code" }, server.code || server.name),
        server.access ? h("span", { class: "chip" }, server.access) : null
      ),
      h("h3", {}, server.name),
      server.platform ? h("p", { class: "platform" }, server.platform) : null,
      server.blurb ? h("p", { class: "blurb" }, server.blurb) : null,
      server.addressNote ? h("p", { class: "confirm-note" }, server.addressNote) : null,
      server.address ? addressCode(server.address) : null,
      server.joinCode ? h("div", { class: "join-code-block" },
        h("p", { class: "code-label" }, "Join code"),
        h("p", { class: "join-code" }, server.joinCode)
      ) : null,
      server.instructions ? h("p", { class: "instructions" }, server.instructions) : null,
      actions.length ? h("div", { class: "card-actions" }, actions) : null,
      statusBox(server),
      h("span", { class: "sr-only", "data-announce": "", "aria-live": "polite" })
    );
  }

  function renderServers() {
    return h("section", { class: "section", id: "servers" },
      h("div", { class: "section-head" },
        h("div", {},
          h("p", { class: "kicker" }, "Worlds"),
          h("h2", {}, "The servers")
        ),
        h("button", { type: "button", class: "btn btn-steel", id: "refresh-status" }, "Refresh status")
      ),
      h("p", { class: "section-intro" }, "Minecraft cards check in live. Copy an address, or open a map where we have one. Valheim stays a join code."),
      h("p", { class: "checked", id: "status-checked" }, "Checking servers…"),
      h("div", { class: "server-grid" }, (cfg.servers || []).map(renderServer))
    );
  }

  function renderJoin() {
    var join = cfg.join || {};
    return h("section", { class: "section", id: "join" },
      h("p", { class: "kicker" }, "Start here"),
      h("h2", {}, "How to join"),
      join.intro ? h("p", { class: "section-intro" }, join.intro) : null,
      h("div", { class: "join-grid" }, (join.tracks || []).map(function (track) {
        return h("article", { class: "join-track" },
          h("h3", {}, track.title),
          track.detail ? h("p", { class: "track-detail" }, track.detail) : null,
          h("ol", {}, (track.steps || []).map(function (step) { return h("li", {}, step); })),
          track.links && track.links.length ? h("ul", { class: "pack-links" }, track.links.map(function (link) {
            return h("li", {}, external(link.url, "text-link", link.label));
          })) : null,
          track.note ? h("p", { class: "note" }, track.note) : null
        );
      }))
    );
  }

  function renderRanks() {
    return h("section", { class: "section", id: "ranks" },
      h("p", { class: "kicker" }, "Reputation"),
      h("h2", {}, "Ranks"),
      h("p", { class: "section-intro" }, "Member comes with Discord verify. The rest is time, a staff pick, or a staff role."),
      h("div", { class: "rank-list" }, (cfg.ranks || []).map(function (rank, index) {
        var number = String(index + 1).padStart(2, "0");
        return h("article", { class: "rank" + (rank.highlight ? " is-highlight" : "") },
          h("div", { class: "rank-name" },
            h("span", { class: "rank-index" }, number),
            h("h3", {}, rank.name)
          ),
          h("p", {}, rank.summary)
        );
      }))
    );
  }

  function renderRules() {
    return h("section", { class: "section", id: "rules" },
      h("p", { class: "kicker" }, "House rules"),
      h("h2", {}, "Rules"),
      cfg.rulesIntro ? h("p", { class: "rules-intro" }, cfg.rulesIntro) : null,
      h("ol", { class: "rules" }, (cfg.rules || []).map(function (rule) { return h("li", {}, rule); }))
    );
  }

  function renderVote() {
    var groups = (cfg.servers || []).filter(function (server) {
      return Array.isArray(server.votes) && server.votes.length;
    });
    return h("section", { class: "section", id: "vote" },
      h("p", { class: "kicker" }, "Keep the forge lit"),
      h("h2", {}, "Vote"),
      h("p", { class: "vote-message" }, cfg.voteMessage),
      h("p", { class: "vote-hint" }, "Each button opens that site's vote page. Most lists ask for your Minecraft name."),
      h("div", { class: "vote-list" }, groups.map(function (server) {
        return h("article", { class: "vote-group" },
          h("h3", {}, server.name),
          h("div", { class: "vote-actions" }, server.votes.map(function (vote) {
            return external(vote.url, "btn btn-vote", "Vote · " + vote.label);
          }))
        );
      }))
    );
  }

  function renderFooter() {
    return h("footer", { class: "site-footer" },
      h("div", { class: "wrap footer-inner" },
        h("p", { class: "footer-brand" }, cfg.name),
        discordLink("btn btn-ember", "Join Discord"),
        h("p", { class: "soon" }, "Coming soon: " + (cfg.comingSoon || "Palworld"))
      )
    );
  }

  function watchSections() {
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    if (!("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          var on = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("is-current", on);
          if (on) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function copyText(text, button, what) {
    var value = String(text || "");
    var announce = button.closest("article");
    announce = announce ? announce.querySelector("[data-announce]") : null;
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

  function fallbackCopy(value) {
    var field = h("textarea", { class: "clipboard-sink", readonly: "readonly" });
    field.value = value;
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    field.remove();
    return ok;
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

  function paintStatus(card, server, snapshot, failed) {
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

  function loadStatus(server, parentSignal, token) {
    var card = document.querySelector('[data-server="' + server.id + '"]');
    var url = minecraftStatusUrl(server.address);
    if (!card || !/^[a-z0-9-]+$/.test(server.id)) return Promise.resolve();
    if (!url) {
      paintStatus(card, server, null, true);
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
        paintStatus(card, server, readStatus(data), false);
      })
      .catch(function () {
        if (token !== round) return;
        paintStatus(card, server, null, true);
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
    var jobs = (cfg.servers || []).filter(function (server) {
      return server.game === "minecraft";
    }).map(function (server) {
      return loadStatus(server, active.signal, token);
    });
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

  function init() {
    if (!cfg || !app) {
      if (app) app.textContent = "Site config failed to load.";
      return;
    }
    document.title = cfg.name;
    var description = document.querySelector('meta[name="description"]');
    if (description && cfg.tagline) description.setAttribute("content", cfg.tagline + " " + cfg.lede);

    var menuApi = function (toggle, mobile) { openMenu(toggle, mobile); };
    app.replaceChildren(
      renderHeader(menuApi),
      h("main", { id: "content", class: "wrap" },
        renderHero(),
        renderServers(),
        renderJoin(),
        renderRanks(),
        renderRules(),
        renderVote()
      ),
      renderFooter()
    );

    var refresh = document.getElementById("refresh-status");
    if (refresh) refresh.addEventListener("click", function () { maybeRefresh(true); });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      var toggle = document.querySelector(".nav-toggle");
      var mobile = document.getElementById("mobile-nav");
      if (toggle && mobile) closeMenu(toggle, mobile);
    });
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
