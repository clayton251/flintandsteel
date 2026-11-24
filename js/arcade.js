(function () {
  "use strict";

  var CORES = {
    nes: "NES",
    snes: "Super Nintendo",
    gb: "Game Boy / Color",
    gba: "Game Boy Advance",
    n64: "Nintendo 64",
    nds: "Nintendo DS",
    segaMD: "Sega Genesis / Mega Drive",
    segaMS: "Sega Master System",
    segaGG: "Sega Game Gear",
    psx: "PlayStation",
    atari2600: "Atari 2600"
  };
  var BY_EXT = {
    nes: "nes",
    fds: "nes",
    unf: "nes",
    sfc: "snes",
    smc: "snes",
    gb: "gb",
    gbc: "gb",
    gba: "gba",
    n64: "n64",
    z64: "n64",
    v64: "n64",
    nds: "nds",
    md: "segaMD",
    gen: "segaMD",
    smd: "segaMD",
    sms: "segaMS",
    gg: "segaGG",
    chd: "psx",
    pbp: "psx",
    cue: "psx",
    bin: "psx",
    a26: "atari2600"
  };
  var AMBIGUOUS = { zip: true, bin: true, chd: true, pbp: true, cue: true };

  var session = 0;
  var frame = null;
  var onMessage = null;
  var romFile = null;
  var liveRomUrl = "";
  var liveBiosUrl = "";

  function $(id) {
    return document.getElementById(id);
  }

  function setStatus(text) {
    var node = $("player-status");
    if (node) node.textContent = text;
  }

  function extensionOf(name) {
    var parts = String(name || "").toLowerCase().split(".");
    return parts.length > 1 ? parts.pop() : "";
  }

  function cleanName(name) {
    var cleaned = String(name || "ROM").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
    if (!cleaned) cleaned = "ROM";
    return cleaned.length > 80 ? cleaned.slice(0, 79) + "…" : cleaned;
  }

  function gameIdFor(file) {
    var seed = file.name + ":" + file.size + ":" + file.lastModified;
    var hash = 2166136261;
    for (var i = 0; i < seed.length; i++) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % 2000000000 + 100000;
  }

  function releaseLiveUrls() {
    if (liveRomUrl.indexOf("blob:") === 0) URL.revokeObjectURL(liveRomUrl);
    if (liveBiosUrl.indexOf("blob:") === 0) URL.revokeObjectURL(liveBiosUrl);
    liveRomUrl = "";
    liveBiosUrl = "";
  }

  function teardown() {
    if (onMessage) {
      window.removeEventListener("message", onMessage);
      onMessage = null;
    }
    if (frame) {
      var old = frame;
      frame = null;
      old.src = "about:blank";
      old.remove();
    }
    releaseLiveUrls();
  }

  function showIdle() {
    var stage = $("stage-frame");
    var idle = $("stage-idle");
    var close = $("player-close");
    if (stage) stage.hidden = true;
    if (idle) idle.hidden = false;
    if (close) close.hidden = true;
  }

  function closeGame() {
    session += 1;
    teardown();
    showIdle();
    setStatus("Game closed. The previous emulator, including its audio, has been stopped.");
  }

  function play(spec) {
    var token = ++session;
    teardown();
    var holder = $("stage-frame");
    var idle = $("stage-idle");
    var close = $("player-close");
    if (!holder) return;
    var romUrl = spec.romUrl || "";
    var biosUrl = "";
    if (spec.romFile) {
      romUrl = URL.createObjectURL(spec.romFile);
      liveRomUrl = romUrl;
    }
    if (spec.biosFile) {
      biosUrl = URL.createObjectURL(spec.biosFile);
      liveBiosUrl = biosUrl;
    }
    holder.hidden = false;
    if (idle) idle.hidden = true;
    if (close) close.hidden = false;
    holder.replaceChildren();
    var iframe = document.createElement("iframe");
    iframe.className = "player-frame";
    iframe.title = spec.name + " emulator";
    iframe.setAttribute("allow", "fullscreen");
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-downloads allow-pointer-lock allow-modals");
    iframe.src = "/arcade/player.html?t=" + token;
    frame = iframe;
    var started = false;
    onMessage = function (event) {
      if (token !== session) return;
      if (!frame || event.source !== frame.contentWindow) return;
      if (event.origin !== location.origin) return;
      var data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "ready") {
        frame.contentWindow.postMessage({
          type: "play",
          token: token,
          core: spec.core,
          name: spec.name,
          gameId: spec.gameId,
          romUrl: romUrl,
          romFile: spec.romFile || null,
          biosUrl: biosUrl,
          biosFile: spec.biosFile || null
        }, location.origin);
        try { frame.contentWindow.focus(); } catch (err) { /* focus can wait for a click */ }
      } else if (data.type === "started") {
        started = true;
        setStatus("Playing " + spec.name + ". Click the screen if the sound is waiting.");
      } else if (data.type === "error") {
        setStatus(data.message || "The emulator could not start.");
      }
    };
    window.addEventListener("message", onMessage);
    holder.appendChild(iframe);
    setStatus("Loading " + spec.name + "…");
    window.setTimeout(function () {
      if (token !== session || started) return;
      setStatus("Still loading " + spec.name + ". Click the game screen if the browser is waiting.");
    }, 12000);
  }

  function syncPlayButton() {
    var button = $("rom-play");
    var system = $("rom-system");
    if (!button || !system) return;
    button.disabled = !(romFile && CORES[system.value]);
  }

  function describeFile() {
    var picked = $("rom-picked");
    var system = $("rom-system");
    if (!picked || !system) return;
    if (!romFile) {
      picked.textContent = "No ROM chosen yet.";
      syncPlayButton();
      return;
    }
    var ext = extensionOf(romFile.name);
    var detected = BY_EXT[ext] || "";
    if (detected && !system.dataset.touched) system.value = detected;
    var core = system.value;
    var line = cleanName(romFile.name);
    if (ext === "zip") {
      line += " — choose a system. Zip files are not auto-detected.";
    } else if (AMBIGUOUS[ext] && core) {
      line += " — set to " + CORES[core] + ". Change the system if that is wrong.";
    } else if (core && CORES[core]) {
      line += " — " + CORES[core] + ".";
    } else {
      line += " — choose a system.";
    }
    picked.textContent = line;
    syncPlayButton();
  }

  function takeRom(file) {
    if (!file) return;
    romFile = file;
    var system = $("rom-system");
    if (system) delete system.dataset.touched;
    var ext = extensionOf(file.name);
    if (system && BY_EXT[ext]) system.value = BY_EXT[ext];
    else if (system) system.value = "";
    describeFile();
  }

  function chosenBios() {
    var input = $("bios-file");
    if (!input || !input.files || !input.files[0]) return null;
    return input.files[0];
  }

  function init() {
    var zone = $("drop-zone");
    var input = $("rom-file");
    var system = $("rom-system");
    var form = $("rom-form");
    var bios = $("bios-file");
    var biosName = $("bios-name");
    var close = $("player-close");

    if (zone) {
      ["dragenter", "dragover"].forEach(function (type) {
        zone.addEventListener(type, function (event) {
          event.preventDefault();
          zone.classList.add("is-hot");
        });
      });
      zone.addEventListener("dragleave", function () {
        zone.classList.remove("is-hot");
      });
      zone.addEventListener("drop", function (event) {
        event.preventDefault();
        zone.classList.remove("is-hot");
        var files = event.dataTransfer && event.dataTransfer.files;
        if (files && files[0]) takeRom(files[0]);
      });
    }
    document.addEventListener("dragover", function (event) { event.preventDefault(); });
    document.addEventListener("drop", function (event) {
      event.preventDefault();
      if (zone) zone.classList.remove("is-hot");
    });
    if (input) {
      input.addEventListener("change", function () {
        if (input.files && input.files[0]) takeRom(input.files[0]);
      });
    }
    if (system) {
      system.addEventListener("change", function () {
        system.dataset.touched = "1";
        describeFile();
      });
    }
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!romFile || !system || !CORES[system.value]) return;
        play({
          name: cleanName(romFile.name),
          core: system.value,
          gameId: gameIdFor(romFile),
          romFile: romFile,
          biosFile: chosenBios()
        });
      });
    }
    if (bios && biosName) {
      bios.addEventListener("change", function () {
        var file = bios.files && bios.files[0];
        biosName.textContent = file ? "BIOS: " + cleanName(file.name) + ". It stays in this browser." : "";
      });
    }
    if (close) close.addEventListener("click", closeGame);
    Array.prototype.forEach.call(document.querySelectorAll("[data-play]"), function (button) {
      button.addEventListener("click", function () {
        var core = button.getAttribute("data-play-core") || "";
        var url = button.getAttribute("data-play-url") || "";
        if (!CORES[core] || !/^\/arcade\/homebrew\/[A-Za-z0-9._-]+$/.test(url)) return;
        play({
          name: button.getAttribute("data-play-name") || "Homebrew",
          core: core,
          gameId: Number(button.getAttribute("data-play-id")) || 1,
          romUrl: url,
          biosFile: null
        });
        var stage = $("play");
        if (stage && stage.scrollIntoView) {
          var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          stage.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
        }
      });
    });
    describeFile();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
