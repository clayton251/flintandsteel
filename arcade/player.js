(function () {
  "use strict";

  var CORES = {
    nes: true,
    snes: true,
    gb: true,
    gba: true,
    n64: true,
    nds: true,
    segaMD: true,
    segaMS: true,
    segaGG: true,
    psx: true,
    atari2600: true
  };
  var DATA = "https://cdn.emulatorjs.org/stable/data/";
  var booted = false;

  function report(type, token, message) {
    parent.postMessage({ type: type, token: token, message: message || "" }, location.origin);
  }

  function allowedGameUrl(url) {
    if (typeof url !== "string" || !url) return "";
    if (url.indexOf("blob:") === 0) return url;
    if (/^\/arcade\/homebrew\/[A-Za-z0-9._-]+$/.test(url)) return url;
    return "";
  }

  function fail(token, message) {
    var waiting = document.getElementById("waiting");
    if (waiting) waiting.textContent = message;
    report("error", token, message);
  }

  function boot(data) {
    if (booted) return;
    var token = data.token;
    var core = data.core;
    var gameUrl = "";
    var biosUrl = "";
    if (!CORES[core]) {
      fail(token, "That system is not available.");
      return;
    }
    if (data.romFile instanceof Blob) gameUrl = URL.createObjectURL(data.romFile);
    else gameUrl = allowedGameUrl(data.romUrl);
    if (!gameUrl) {
      fail(token, "The ROM could not be opened in this browser.");
      return;
    }
    if (data.biosFile instanceof Blob) biosUrl = URL.createObjectURL(data.biosFile);
    else if (typeof data.biosUrl === "string" && data.biosUrl.indexOf("blob:") === 0) biosUrl = data.biosUrl;
    booted = true;
    var waiting = document.getElementById("waiting");
    if (waiting) waiting.textContent = "Loading " + (data.name || "the game") + "…";
    window.EJS_player = "#game";
    window.EJS_core = core;
    window.EJS_gameUrl = gameUrl;
    window.EJS_biosUrl = biosUrl;
    window.EJS_pathtodata = DATA;
    window.EJS_startOnLoaded = true;
    window.EJS_threads = false;
    window.EJS_gameID = typeof data.gameId === "number" ? data.gameId : 1;
    window.EJS_gameName = typeof data.name === "string" ? data.name.slice(0, 80) : "Game";
    window.EJS_color = "#ff6a2a";
    window.EJS_backgroundColor = "#0e0c0a";
    window.EJS_volume = 0.7;
    window.EJS_onGameStart = function () {
      document.body.classList.add("is-running");
      report("started", token, "");
    };
    var script = document.createElement("script");
    script.src = DATA + "loader.js";
    script.async = true;
    script.onerror = function () {
      fail(token, "The emulator could not be loaded.");
    };
    document.body.appendChild(script);
  }

  window.addEventListener("message", function (event) {
    if (event.origin !== location.origin) return;
    var data = event.data;
    if (!data || typeof data !== "object" || data.type !== "play") return;
    boot(data);
  });

  parent.postMessage({ type: "ready" }, location.origin);
})();
