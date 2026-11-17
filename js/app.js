(function () {
  "use strict";

  var cfg = window.FAS_CONFIG;
  var live = document.getElementById("live-region");
  var sweepToken = 0;
  var lastSweepAt = 0;
  var REFRESH_MS = 60000;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function safeUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      var url = new URL(value.trim());
      if (url.protocol === "https:" || url.protocol === "http:") return url.href;
    } catch (err) {
      return "";
    }
    return "";
  }

  function safeHost(value) {
    if (typeof value !== "string") return "";
    var host = value.trim();
    if (!/^[a-z0-9.-]{1,253}(?::\d{1,5})?$/i.test(host)) return "";
    return host;
  }

  function safeCode(value) {
    var code = String(value == null ? "" : value).trim();
    if (!/^[a-z0-9-]{2,32}$/i.test(code)) return "";
    return code;
  }

  function say(message) {
    if (!live) return;
    live.textContent = "";
    window.setTimeout(function () {
      live.textContent = message;
    }, 30);
  }

  function valheimCode() {
    var servers = (cfg && cfg.servers) || [];
    for (var i = 0; i < servers.length; i += 1) {
      if (servers[i].kind === "valheim") return safeCode(servers[i].joinCode);
    }
    return "";
  }

  function fillText(selector, value) {
    if (!value) return;
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i += 1) nodes[i].textContent = value;
  }

  function applyIdentity() {
    if (!cfg) return;
    fillText("[data-tagline]", cfg.tagline);
    fillText("[data-coming]", cfg.comingSoon ? "Coming soon: " + cfg.comingSoon : "");
    fillText("[data-vote-note]", cfg.voteNote);
    var discord = safeUrl(cfg.discord);
    if (!discord) return;
    var links = document.querySelectorAll("[data-discord]");
    for (var i = 0; i < links.length; i += 1) links[i].setAttribute("href", discord);
  }

  function iconSvg(name) {
    if (name === "copy") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15 V5 h10" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
    }
    if (name === "out") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5 h5 v5 M19 5 l-8 8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7 H6 v12 h12 v-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
    }
    return "";
  }

  function renderServers() {
    var mount = document.getElementById("server-grid");
    if (!mount) return;
    var servers = (cfg && cfg.servers) || [];
    if (!servers.length) {
      mount.innerHTML = '<p class="empty">No servers in config.js yet.</p>';
      return;
    }

    mount.innerHTML = servers.map(function (server) {
      var isValheim = server.kind === "valheim";
      var host = safeHost(server.address);
      var code = safeCode(server.joinCode);
      var map = safeUrl(server.map);
      var tags = (server.tags || []).map(function (tag) {
        return '<li>' + esc(tag) + '</li>';
      }).join("");
      var copyValue = isValheim ? code : host;
      var copyLabel = isValheim ? server.name + " join code" : server.name + " address";
      var links = "";
      if (map) {
        links += '<a class="text-link" href="' + esc(map) + '" target="_blank" rel="noopener noreferrer">Live map ' + iconSvg("out") + '</a>';
      }
      if (!isValheim && server.votes && server.votes.length) {
        links += '<a class="text-link" href="#vote-' + esc(server.id) + '">Vote</a>';
      }

      var stats = isValheim
        ? '<div class="stat"><span>Join code</span><strong class="digits">' + esc(code || "—") + '</strong></div>' +
          '<div class="stat"><span>How</span><strong>Crossplay</strong></div>'
        : '<div class="stat"><span>Players</span><strong data-players-for="' + esc(server.id) + '">…</strong></div>' +
          '<div class="stat"><span>Version</span><strong data-version-for="' + esc(server.id) + '">…</strong></div>';

      var addressRow = isValheim
        ? '<p class="join-help">' + esc(server.joinHelp || "") + '</p>' +
          (copyValue
            ? '<button type="button" class="copy-btn" data-copy="' + esc(copyValue) + '" data-copy-label="' + esc(copyLabel) + '">' + iconSvg("copy") + '<span>Copy code</span></button>'
            : '<p class="join-help">Add a join code in config.js.</p>')
        : '<div class="address">' +
            '<code>' + esc(host || "Address missing in config.js") + '</code>' +
            (copyValue ? '<button type="button" class="copy-btn" data-copy="' + esc(copyValue) + '" data-copy-label="' + esc(copyLabel) + '">' + iconSvg("copy") + '<span>Copy</span></button>' : "") +
          '</div>';

      var pill = isValheim
        ? '<p class="status is-crossplay"><span class="status-dot"></span><span>Crossplay</span></p>'
        : '<p class="status is-checking" data-status-for="' + esc(server.id) + '"><span class="status-dot"></span><span data-status-label>Checking</span></p>';

      return '' +
        '<article class="server-card' + (isValheim ? " is-banner" : "") + '" id="server-' + esc(server.id) + '">' +
          '<header class="server-top">' +
            '<div class="mark">' +
              '<img alt="" hidden data-icon-for="' + esc(server.id) + '" width="64" height="64">' +
              '<span class="mark-fallback">' + esc(server.short || server.name.slice(0, 3)) + '</span>' +
            '</div>' +
            '<div class="server-id">' +
              '<h3>' + esc(server.name) + '</h3>' +
              (tags ? '<ul class="tags">' + tags + '</ul>' : '') +
            '</div>' +
            pill +
          '</header>' +
          '<p class="blurb">' + esc(server.blurb || "") + '</p>' +
          '<div class="stats">' + stats + '</div>' +
          addressRow +
          (links ? '<div class="card-links">' + links + '</div>' : '') +
        '</article>';
    }).join("");
  }

  function renderJoin() {
    var mount = document.getElementById("join-grid");
    if (!mount || !cfg) return;
    var code = valheimCode();
    mount.innerHTML = (cfg.join || []).map(function (block, index) {
      var steps = (block.steps || []).map(function (step) {
        return '<li>' + esc(String(step).replaceAll("{valheimCode}", code || "the join code")) + '</li>';
      }).join("");
      return '' +
        '<article class="join-card">' +
          '<p class="step-index">' + esc(String(index + 1).padStart(2, "0")) + '</p>' +
          '<h3>' + esc(block.title) + '</h3>' +
          '<p class="join-lede">' + esc(block.lede || "") + '</p>' +
          '<ol>' + steps + '</ol>' +
        '</article>';
    }).join("");
  }

  function renderRanks() {
    var mount = document.getElementById("rank-list");
    if (!mount || !cfg) return;
    mount.innerHTML = (cfg.ranks || []).map(function (rank, index) {
      return '' +
        '<li class="rank">' +
          '<span class="rank-index">' + esc(String(index + 1).padStart(2, "0")) + '</span>' +
          '<div><h3>' + esc(rank.name) + '</h3><p>' + esc(rank.detail) + '</p></div>' +
        '</li>';
    }).join("");
  }

  function renderRules() {
    var mount = document.getElementById("rule-list");
    if (!mount || !cfg) return;
    mount.innerHTML = (cfg.rules || []).map(function (rule) {
      return '<li>' + esc(rule) + '</li>';
    }).join("");
  }

  function renderVotes() {
    var mount = document.getElementById("vote-grid");
    if (!mount || !cfg) return;
    var blocks = (cfg.servers || []).filter(function (server) {
      return server.votes && server.votes.length;
    });
    if (!blocks.length) {
      mount.innerHTML = '<p class="empty">No vote links in config.js yet.</p>';
      return;
    }
    mount.innerHTML = blocks.map(function (server) {
      var buttons = server.votes.map(function (vote) {
        var href = safeUrl(vote.href);
        if (!href) return "";
        var label = vote.label || "Vote";
        return '<a class="vote-link" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' +
          '<span>' + esc(label) + '</span>' + iconSvg("out") +
        '</a>';
      }).join("");
      return '' +
        '<article class="vote-card" id="vote-' + esc(server.id) + '">' +
          '<header><h3>' + esc(server.name) + '</h3><a class="text-link" href="#server-' + esc(server.id) + '">Server card</a></header>' +
          '<div class="vote-links">' + buttons + '</div>' +
        '</article>';
    }).join("");
  }

  function setStatus(id, state, label) {
    var node = document.querySelector('[data-status-for="' + id + '"]');
    if (!node) return;
    node.classList.remove("is-checking", "is-online", "is-offline", "is-unknown");
    node.classList.add(state);
    var text = node.querySelector("[data-status-label]");
    if (text) text.textContent = label;
  }

  function setField(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function cleanVersion(version) {
    var raw = "";
    if (version && typeof version === "object") raw = version.name_clean || version.name_raw || "";
    return String(raw).replace(/§./g, "").replace(/\s+/g, " ").trim();
  }

  function usableIcon(icon) {
    if (typeof icon !== "string") return "";
    if (icon.length > 120000) return "";
    if (!/^data:image\/(png|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(icon)) return "";
    return icon;
  }

  function applyIcon(id, icon) {
    var src = usableIcon(icon);
    if (!src) return;
    var img = document.querySelector('[data-icon-for="' + id + '"]');
    if (!img) return;
    img.src = src;
    img.hidden = false;
    var fallback = img.parentElement && img.parentElement.querySelector(".mark-fallback");
    if (fallback) fallback.hidden = true;
  }

  function playerText(players) {
    if (!players || typeof players !== "object") return "—";
    var online = players.online;
    var max = players.max;
    if (typeof online !== "number") return "—";
    if (typeof max === "number") return online + "/" + max;
    return String(online);
  }

  function summarize(results) {
    var minecraft = results.filter(function (item) { return item.kind === "java"; });
    var online = minecraft.filter(function (item) { return item.state === "online"; });
    var failed = minecraft.filter(function (item) { return item.state === "unknown"; });
    var players = online.reduce(function (sum, item) { return sum + item.players; }, 0);
    var pulse = document.getElementById("forge-pulse");
    if (!pulse) return;

    if (!minecraft.length) {
      pulse.textContent = "No Minecraft servers are configured.";
      return;
    }

    var serverBit = online.length + " of " + minecraft.length + " Minecraft servers online";
    var peopleBit = players === 1 ? "1 player in game" : players + " players in game";
    var text = serverBit + " · " + peopleBit;
    if (failed.length) text += " · " + failed.length + " status check" + (failed.length === 1 ? "" : "s") + " didn’t answer";
    pulse.textContent = text;
  }

  function checkServer(server, token) {
    var host = safeHost(server.address);
    var api = safeUrl(cfg.statusApi);
    if (!host || !api) {
      setStatus(server.id, "is-unknown", "No address");
      setField('[data-players-for="' + server.id + '"]', "—");
      setField('[data-version-for="' + server.id + '"]', "—");
      return Promise.resolve({ id: server.id, kind: "java", state: "unknown", players: 0 });
    }

    setStatus(server.id, "is-checking", "Checking");
    var endpoint = api.replace(/\/?$/, "/") + encodeURIComponent(host);
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, 8000) : null;

    return fetch(endpoint, {
      cache: "no-store",
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (!response.ok) throw new Error("status " + response.status);
      return response.json();
    }).then(function (data) {
      if (token !== sweepToken) return null;
      if (!data || data.online !== true) {
        setStatus(server.id, "is-offline", "Offline");
        setField('[data-players-for="' + server.id + '"]', "—");
        setField('[data-version-for="' + server.id + '"]', "—");
        return { id: server.id, kind: "java", state: "offline", players: 0 };
      }
      var count = data.players && typeof data.players.online === "number" ? data.players.online : 0;
      var version = cleanVersion(data.version) || "Unknown";
      setStatus(server.id, "is-online", "Online");
      setField('[data-players-for="' + server.id + '"]', playerText(data.players));
      var versionNode = document.querySelector('[data-version-for="' + server.id + '"]');
      if (versionNode) {
        versionNode.textContent = version;
        versionNode.title = version;
      }
      applyIcon(server.id, data.icon);
      return { id: server.id, kind: "java", state: "online", players: count };
    }).catch(function () {
      if (token !== sweepToken) return null;
      setStatus(server.id, "is-unknown", "No response");
      setField('[data-players-for="' + server.id + '"]', "—");
      setField('[data-version-for="' + server.id + '"]', "—");
      return { id: server.id, kind: "java", state: "unknown", players: 0 };
    }).finally(function () {
      if (timer) window.clearTimeout(timer);
    });
  }

  function refreshStatus() {
    if (!cfg || !cfg.servers) return Promise.resolve();
    var token = sweepToken + 1;
    sweepToken = token;
    var jobs = cfg.servers
      .filter(function (server) { return server.kind === "java"; })
      .map(function (server) { return checkServer(server, token); });

    return Promise.all(jobs).then(function (results) {
      if (token !== sweepToken) return;
      lastSweepAt = Date.now();
      summarize(results.filter(Boolean));
    });
  }

  function legacyCopy(value) {
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        var ok = document.execCommand("copy");
        document.body.removeChild(area);
        if (ok) resolve();
        else reject(new Error("copy failed"));
      } catch (err) {
        document.body.removeChild(area);
        reject(err);
      }
    });
  }

  function copyText(value) {
    // clipboard.writeText can hang when permission is pending. Fall back quickly.
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return new Promise(function (resolve, reject) {
        var settled = false;
        var timer = window.setTimeout(function () {
          if (settled) return;
          settled = true;
          legacyCopy(value).then(resolve, reject);
        }, 600);
        navigator.clipboard.writeText(value).then(function () {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          resolve();
        }, function () {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          legacyCopy(value).then(resolve, reject);
        });
      });
    }
    return legacyCopy(value);
  }

  function bindCopy() {
    document.addEventListener("click", function (event) {
      var button = event.target.closest(".copy-btn");
      if (!button) return;
      var value = button.getAttribute("data-copy") || "";
      var label = button.getAttribute("data-copy-label") || "Value";
      var caption = button.querySelector("span");
      var original = caption ? caption.textContent : "Copy";
      copyText(value).then(function () {
        button.classList.add("is-copied");
        if (caption) caption.textContent = "Copied";
        say("Copied " + label);
        window.setTimeout(function () {
          button.classList.remove("is-copied");
          if (caption) caption.textContent = original;
        }, 2200);
      }).catch(function () {
        if (caption) caption.textContent = "Select it";
        say("Could not copy " + label + ". Select it manually.");
      });
    });
  }

  function bindNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    var label = toggle && toggle.querySelector("[data-toggle-label]");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (label) label.textContent = open ? "Close" : "Menu";
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });

    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    if (!("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.removeAttribute("aria-current"); });
        var match = links.filter(function (link) {
          return link.getAttribute("href") === "#" + entry.target.id;
        })[0];
        if (match) match.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 });

    links.forEach(function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      if (section) observer.observe(section);
    });
  }

  function bindRefresh() {
    var button = document.getElementById("refresh-status");
    if (!button) return;
    button.addEventListener("click", function () {
      refreshStatus().then(function () { say("Server status updated"); });
    });
    window.setInterval(refreshStatus, REFRESH_MS);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && Date.now() - lastSweepAt > 45000) refreshStatus();
    });
  }

  function showFatal(error) {
    var mount = document.getElementById("server-grid");
    if (mount) {
      mount.innerHTML = '<p class="empty">The page script hit a problem. Check config.js. ' + esc(error && error.message ? error.message : "") + '</p>';
    }
  }

  try {
    if (!cfg) throw new Error("config.js did not load");
    applyIdentity();
    renderServers();
    renderJoin();
    renderRanks();
    renderRules();
    renderVotes();
    bindCopy();
    bindNav();
    bindRefresh();
    refreshStatus();
  } catch (error) {
    showFatal(error);
  }
})();
