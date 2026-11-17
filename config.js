// Flint and Steel site config
// Edit this file to change servers, join steps, ranks, rules, and vote links.
// Keep every address as the public hostname players already use.
// Do not add LAN IPs, home hostnames, or private ports.

window.FAS_CONFIG = {
  name: "Flint and Steel Network",
  tagline: "A small public game-server community, run by Clayton, a veteran.",
  discord: "https://discord.gg/zWJfDJQcgP",
  comingSoon: "Palworld",
  // Public status API. HTTPS and CORS-friendly. Do not switch this to an http page.
  statusApi: "https://api.mcstatus.io/v2/status/java/",
  voteNote: "Every vote helps keep the servers online.",

  servers: [
    {
      id: "atm10",
      name: "All the Mods 10",
      short: "ATM",
      kind: "java",
      address: "atm10.flintandsteel.playit.plus",
      blurb: "Modded tech on NeoForge 1.21.1. Discord-linked whitelist.",
      tags: ["NeoForge 1.21.1", "Whitelist"],
      map: "http://atm10map.flintandsteel.playit.plus:43450",
      votes: [
        {
          label: "Modded Minecraft Servers",
          href: "https://moddedminecraftservers.com/server/flint-and-steel-network-all-the-mods-10.61130/"
        },
        {
          label: "Minecraft-MP",
          href: "https://minecraft-mp.com/server/366978/vote/"
        },
        {
          label: "FTB Servers",
          href: "https://ftbservers.com/server/jekrTF3G/vote"
        },
        {
          label: "MinecraftServers.org",
          href: "https://minecraftservers.org/vote/696265"
        },
        {
          label: "Minecraft Server List",
          href: "https://minecraft-server-list.com/server/525025/vote/"
        }
      ]
    },
    {
      id: "vanilla",
      name: "Vanilla Survival",
      short: "VAN",
      kind: "java",
      address: "vanilla.flintandsteel.playit.plus",
      blurb: "Paper survival with a castle spawn. Open to everyone.",
      tags: ["Paper", "Open"],
      map: "http://map.flintandsteel.playit.plus:45481",
      votes: [
        {
          label: "Minecraft-MP",
          href: "https://minecraft-mp.com/server/366990/vote/"
        },
        {
          label: "MinecraftServers.org",
          href: "https://minecraftservers.org/vote/696273"
        },
        {
          label: "Minecraft Server List",
          href: "https://minecraft-server-list.com/server/525029/vote/"
        }
      ]
    },
    {
      id: "cabab",
      name: "Create: Above and Beyond",
      short: "CAB",
      kind: "java",
      address: "cabab.flintandsteel.playit.plus",
      blurb: "The 1.16.5 Create modpack. Whitelisted through Discord.",
      tags: ["Minecraft 1.16.5", "Whitelist"],
      map: "",
      votes: [
        {
          label: "Modded Minecraft Servers",
          href: "https://moddedminecraftservers.com/server/flint-and-steel-network-create-above-and-beyond.61131/"
        },
        {
          label: "Minecraft-MP",
          href: "https://minecraft-mp.com/server/367005/vote/"
        },
        {
          label: "FTB Servers",
          href: "https://ftbservers.com/server/ZPZZRyCm/vote"
        },
        {
          label: "MinecraftServers.org",
          href: "https://minecraftservers.org/vote/696286"
        },
        {
          label: "TopG",
          href: "https://topg.org/minecraft-servers/server-688623#vote"
        },
        {
          label: "Minecraft Server List",
          href: "https://minecraft-server-list.com/server/525042/vote/"
        }
      ]
    },
    {
      id: "cobblemon",
      // Public hostname. It answered a status check and the MOTD reads
      // "Flint and Steel | Cobblemon". Change this string if the address moves.
      name: "Cobblemon",
      short: "COB",
      kind: "java",
      address: "cobblemon.flintandsteel.playit.plus",
      blurb: "Pokemon modpack with a Pokemon-center themed spawn. Whitelisted through Discord.",
      tags: ["Whitelist"],
      map: "",
      votes: [
        {
          label: "Modded Minecraft Servers",
          href: "https://moddedminecraftservers.com/server/flint-and-steel-network-cobblemon.61132/"
        },
        {
          label: "Minecraft-MP",
          href: "https://minecraft-mp.com/server/367006/vote/"
        },
        {
          label: "FTB Servers",
          href: "https://ftbservers.com/server/EB8QvcZO/vote"
        },
        {
          label: "MinecraftServers.org",
          href: "https://minecraftservers.org/vote/696287"
        },
        {
          label: "TopG",
          href: "https://topg.org/minecraft-servers/server-688624#vote"
        },
        {
          label: "Minecraft Server List",
          href: "https://minecraft-server-list.com/server/525043/vote/"
        }
      ]
    },
    {
      id: "valheim",
      name: "Valheim",
      short: "VAL",
      kind: "valheim",
      blurb: "Crossplay. Join with the code — this world is not checked with Minecraft status.",
      tags: ["Crossplay"],
      joinCode: "308346",
      joinHelp: "Open Valheim, choose Join Game, and enter the code. Crossplay is on.",
      votes: []
    }
  ],

  // {valheimCode} is replaced with the Valheim card's joinCode.
  join: [
    {
      title: "Modded Minecraft",
      lede: "All the Mods 10, Create: Above and Beyond, and Cobblemon.",
      steps: [
        "Install the matching CurseForge modpack: All the Mods 10, Create: Above and Beyond, or Cobblemon.",
        "Join the Discord.",
        "Verify and link your Minecraft account in the #link-account channel to get whitelisted.",
        "Add the server address in Minecraft and connect."
      ]
    },
    {
      title: "Vanilla Survival",
      lede: "No modpack. No whitelist.",
      steps: [
        "Open Minecraft Java Edition.",
        "Multiplayer → Add Server, and paste the Vanilla Survival address.",
        "Connect. You spawn at the castle."
      ]
    },
    {
      title: "Valheim",
      lede: "Crossplay, separate from the Minecraft worlds.",
      steps: [
        "Install Valheim. Crossplay is enabled.",
        "Join a game with code {valheimCode}.",
        "The same Discord is home for this world too."
      ]
    }
  ],

  ranks: [
    {
      name: "Member",
      detail: "Granted when you verify on Discord."
    },
    {
      name: "Veteran",
      detail: "Automatic after 50 hours played: 400 claimed chunks and /fly."
    },
    {
      name: "VIP",
      detail: "Hand-picked by staff."
    },
    {
      name: "Moderator",
      detail: "Staff."
    },
    {
      name: "Admin",
      detail: "Staff."
    }
  ],

  rules: [
    "Be respectful. No harassment, slurs, or personal attacks.",
    "No griefing and no stealing.",
    "No cheats, hacked clients, or x-ray.",
    "No lag machines or anything else that tanks the server.",
    "Keep chat PG-13.",
    "Listen to staff."
  ]
};
