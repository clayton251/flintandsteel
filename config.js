/* Flint and Steel Network — site config.
   The words players and search engines see are in index.html.
   When you change an address, vote link, or description, update both files.
   Use public hostnames only. Do not add LAN IPs or internal hostnames.

   Minecraft join addresses are the public SRV names. Do not add a port to those.
   Palworld, Counter-Strike 2, 7 Days to Die, Terraria, Project Zomboid, Garry's Mod, and DayZ include their public port.
   Live maps and the public status page are HTTPS hosts with no extra path.
   Link the status page only as https://status.flintandsteelnetwork.com.

   Vote links use each site's vote page when that page has its own URL.
   Modded Minecraft Servers and TopG put the vote form on the listing, at #vote. */
window.FNS_CONFIG = {
  name: "Flint and Steel Network",
  tagline: "Strike a spark. Stay for the build.",
  about: "A veteran-run Minecraft and game server network.",
  lede: "All the Mods 10, Create: Above and Beyond, an open vanilla world, a Valheim crossplay server, a Palworld PvE server, Counter-Strike 2, 7 Days to Die, Rust, Terraria, Project Zomboid, Garry's Mod, and DayZ.",
  discordUrl: "https://discord.gg/zWJfDJQcgP",
  comingSoon: "",
  voteMessage: "Every vote helps keep the servers online.",
  servers: [
    {
      id: "atm10",
      name: "All the Mods 10",
      code: "ATM10",
      game: "minecraft",
      platform: "NeoForge 1.21.1",
      blurb: "Modded tech. The whitelist is linked through Discord.",
      address: "atm10.flintandsteelnetwork.com",
      addressConfirmed: true,
      access: "Discord whitelist",
      mapUrl: "https://atm10map.flintandsteelnetwork.com",
      votes: [
        {
          label: "Modded Minecraft Servers",
          url: "https://moddedminecraftservers.com/server/flint-and-steel-network-all-the-mods-10.61130/#vote"
        },
        { label: "Minecraft MP", url: "https://minecraft-mp.com/server/366978/vote/" },
        { label: "FTB Servers", url: "https://ftbservers.com/server/jekrTF3G/vote" },
        { label: "MinecraftServers.org", url: "https://minecraftservers.org/vote/696265" },
        { label: "Minecraft Server List", url: "https://minecraft-server-list.com/server/525025/vote/" }
      ]
    },
    {
      id: "vanilla",
      name: "Vanilla Survival",
      code: "VANILLA",
      game: "minecraft",
      platform: "Paper",
      blurb: "Castle spawn. Open to anyone — add the address and play.",
      address: "vanilla.flintandsteelnetwork.com",
      addressConfirmed: true,
      access: "Open",
      mapUrl: "https://map.flintandsteelnetwork.com",
      votes: [
        { label: "Minecraft MP", url: "https://minecraft-mp.com/server/366990/vote/" },
        { label: "MinecraftServers.org", url: "https://minecraftservers.org/vote/696273" },
        { label: "Minecraft Server List", url: "https://minecraft-server-list.com/server/525029/vote/" }
      ]
    },
    {
      id: "cabab",
      name: "Create: Above and Beyond",
      code: "CABAB",
      game: "minecraft",
      platform: "Create modpack 1.16.5",
      blurb: "The 1.16.5 Create modpack. Whitelisted through Discord.",
      address: "cabab.flintandsteelnetwork.com",
      addressConfirmed: true,
      access: "Discord whitelist",
      votes: [
        {
          label: "Modded Minecraft Servers",
          url: "https://moddedminecraftservers.com/server/flint-and-steel-network-create-above-and-beyond.61131/#vote"
        },
        { label: "Minecraft MP", url: "https://minecraft-mp.com/server/367005/vote/" },
        { label: "FTB Servers", url: "https://ftbservers.com/server/ZPZZRyCm/vote" },
        { label: "MinecraftServers.org", url: "https://minecraftservers.org/vote/696286" },
        { label: "TopG", url: "https://topg.org/minecraft-servers/server-688623#vote" },
        { label: "Minecraft Server List", url: "https://minecraft-server-list.com/server/525042/vote/" }
      ]
    },
    {
      id: "valheim",
      name: "Valheim",
      code: "VALHEIM",
      game: "valheim",
      platform: "Crossplay",
      blurb: "Crossplay world. Steam and Xbox players use the same join code.",
      joinCode: "308346",
      instructions: "Open Valheim, choose Join Game, and enter this code.",
      access: "Join code"
    },
    {
      id: "palworld",
      name: "Flint and Steel Palworld",
      code: "PALWORLD",
      game: "palworld",
      platform: "PvE · Crossplay",
      blurb: "Catch, build, and explore together. PvE, up to 20 players, no password. Steam, Xbox, PS5, and Mac can join.",
      address: "palworld.flintandsteelnetwork.com:49096",
      instructions: "Join Multiplayer Game, open Community Servers, and search for Flint and Steel. Or connect directly with the address.",
      access: "Open"
    },
    {
      id: "cs2",
      name: "Counter-Strike 2",
      code: "CS2",
      game: "cs2",
      platform: "Casual & Deathmatch · 20 players",
      blurb: "Casual and deathmatch. Connect from the developer console.",
      address: "cs2.flintandsteelnetwork.com:1740",
      connect: "connect cs2.flintandsteelnetwork.com:1740",
      instructions: "Open the CS2 developer console and run this command.",
      note: "Find it in Steam > View > Game Servers > Internet (Counter-Strike 2, search 'Flint and Steel'), or open the CS2 console (~) and run the connect command.",
      access: "Open"
    },
    {
      id: "7dtd",
      name: "7 Days to Die",
      code: "7DTD",
      game: "7dtd",
      platform: "PvE co-op · 16 players",
      blurb: "Vanilla V 3.4 on the V1.x line. Navezgane map, PvE with no player killing, and a blood moon horde every 14 days. Easy Anti-Cheat is on. No password.",
      address: "7dtd.flintandsteelnetwork.com:28246",
      listing: "Flint and Steel Network | 7 Days to Die PvE",
      instructions: "Search the in-game server browser for Flint and Steel. The listing is Flint and Steel Network | 7 Days to Die PvE. Or choose Connect to IP and use this address. The port is 28246.",
      access: "Open"
    },
    {
      id: "rust",
      name: "Flint and Steel Network | Vanilla PvP",
      code: "RUST",
      game: "rust",
      platform: "Vanilla PvP · 50 slots",
      blurb: "No mods, kits, or pay-to-win. Raiding is allowed everywhere. No password. Easy Anti-Cheat is on.",
      connect: "client.connect rust.flintandsteelnetwork.com:4311",
      instructions: "Search for Flint and Steel in the Community tab of the server browser, or press F1 and run this command.",
      note: "Procedural Map, size 3500. Monthly forced wipe on the first Thursday, after Facepunch's update, in the afternoon US Eastern. The map and bases wipe. Blueprints are kept unless Facepunch forces a blueprint wipe. Rust+ works.",
      access: "Open"
    },
    {
      id: "terraria",
      name: "Flint and Steel Network | Terraria",
      code: "TERRARIA",
      game: "terraria",
      platform: "1.4.5.8 · Classic · 16 slots",
      blurb: "TShock on a large Classic world named FlintAndSteel. No password.",
      address: "terraria.flintandsteelnetwork.com:4379",
      instructions: "In Terraria, choose Multiplayer, then Join via IP. Use this address. The port is 4379. There is no password.",
      note: "Nightly backups and empty-only automatic restarts and updates run around 6:10 AM ET.",
      access: "Open"
    },
    {
      id: "zomboid",
      name: "Flint and Steel Network | Project Zomboid",
      code: "ZOMBOID",
      game: "zomboid",
      platform: "Build 42 · Vanilla PvE · 32 slots",
      blurb: "Vanilla PvE survival in Muldraugh, KY. No password. VAC secure.",
      address: "zomboid.flintandsteelnetwork.com:57257",
      instructions: "Direct connect or add this address to Favorites. Or find Flint and Steel Network | Project Zomboid in the in-game or Steam server browser.",
      note: "Nightly backups and empty-only automatic restarts and updates run around 6:15 AM ET.",
      access: "Open"
    },
    {
      id: "gmod",
      name: "Flint and Steel Network | Garry's Mod",
      code: "GMOD",
      game: "gmod",
      platform: "Sandbox · 24 slots",
      blurb: "Sandbox on gm_construct. No password. ULX and FPP prop protection.",
      address: "gmod.flintandsteelnetwork.com:61937",
      connect: "connect gmod.flintandsteelnetwork.com:61937",
      instructions: "Open the Garry's Mod console with ~ and run this command. Or add gmod.flintandsteelnetwork.com:61937 to Steam Favorites.",
      note: "Nightly backups and empty-only automatic restarts and updates run around 6:20 AM ET.",
      access: "Open"
    },
    {
      id: "dayz",
      name: "Flint and Steel Network | DayZ Vanilla",
      code: "DAYZ",
      game: "dayz",
      platform: "Vanilla PvP · 40 slots",
      blurb: "Vanilla PvP on Chernarus. No mods and no password. BattlEye is on.",
      address: "dayz.flintandsteelnetwork.com:32783",
      instructions: "Direct Connect or add this address to Favorites. Or search Flint and Steel Network | DayZ Vanilla in the in-game or Steam server browser.",
      note: "Nightly backups and empty-only automatic restarts and updates run around 6:25 AM ET.",
      access: "Open"
    }
  ],
  join: {
    intro: "Modded servers need the matching CurseForge pack and a Discord whitelist. Vanilla is just the address. Valheim is the join code. Palworld is in the community server list. Counter-Strike 2 uses a console connect command. 7 Days to Die is in the in-game server browser. Rust is in the Community tab. Terraria joins by IP. Project Zomboid is in the in-game or Steam server browser. Garry's Mod uses a console connect command or Steam Favorites. DayZ is in the in-game or Steam server browser.",
    tracks: [
      {
        id: "modded",
        title: "Modded servers",
        detail: "All the Mods 10 and Create: Above and Beyond.",
        steps: [
          "Install CurseForge and the matching modpack.",
          "Launch that pack, add the server address from the card, and connect.",
          "Join Discord and open #link-account. Verify and link your Minecraft account there to get whitelisted."
        ],
        links: [
          {
            label: "All the Mods 10 on CurseForge",
            url: "https://www.curseforge.com/minecraft/modpacks/all-the-mods-10"
          },
          {
            label: "Create: Above and Beyond on CurseForge",
            url: "https://www.curseforge.com/minecraft/modpacks/create-above-and-beyond"
          }
        ]
      },
      {
        id: "vanilla",
        title: "Vanilla Survival",
        detail: "Paper, castle spawn, open server.",
        steps: [
          "Open Minecraft Java Edition.",
          "Choose Multiplayer, add a server, and paste the Vanilla address.",
          "Join. There is no whitelist."
        ]
      },
      {
        id: "valheim",
        title: "Valheim",
        detail: "Crossplay.",
        steps: [
          "Open Valheim. Steam and Xbox can join the same world.",
          "Choose Join Game and enter the code on the Valheim card."
        ]
      },
      {
        id: "palworld",
        title: "Palworld",
        detail: "PvE, crossplay, no password, up to 20 players.",
        steps: [
          "Open Palworld and choose Join Multiplayer Game.",
          "Open Community Servers and search for Flint and Steel.",
          "Or paste the address from the Palworld card into the connect box at the bottom."
        ]
      },
      {
        id: "cs2",
        title: "Counter-Strike 2",
        detail: "Casual and deathmatch, up to 20 players.",
        steps: [
          "Install Counter-Strike 2 on Steam.",
          "Enable the developer console in Settings > Game.",
          "Press ~ to open the console.",
          "Paste the connect command from the Counter-Strike 2 card."
        ]
      },
      {
        id: "7dtd",
        title: "7 Days to Die",
        detail: "Vanilla V 3.4, PvE co-op, up to 16 players. No password.",
        steps: [
          "Open 7 Days to Die.",
          "Search the in-game server browser for Flint and Steel. The listing is Flint and Steel Network | 7 Days to Die PvE.",
          "Or choose Connect to IP and paste the address from the card. The port is 28246."
        ]
      },
      {
        id: "rust",
        title: "Rust",
        detail: "Vanilla PvP, 50 slots, no password.",
        steps: [
          "Open Rust and search for Flint and Steel in the Community tab of the server browser.",
          "Or press F1 and paste the connect command from the Rust card.",
          "Use #rust-info, #rust-chat, and #rust-support on the Flint and Steel Discord."
        ]
      },
      {
        id: "terraria",
        title: "Terraria",
        detail: "1.4.5.8 on TShock, Classic, 16 slots, no password.",
        steps: [
          "Open Terraria and choose Multiplayer, then Join via IP.",
          "Enter terraria.flintandsteelnetwork.com and port 4379. There is no password.",
          "The world is the large Classic world FlintAndSteel."
        ]
      },
      {
        id: "zomboid",
        title: "Project Zomboid",
        detail: "Build 42 vanilla PvE, 32 slots, no password.",
        steps: [
          "Open Project Zomboid and choose Direct Connect, or add the address to Favorites.",
          "Use zomboid.flintandsteelnetwork.com:57257. There is no password.",
          "Or find Flint and Steel Network | Project Zomboid in the in-game or Steam server browser."
        ]
      },
      {
        id: "gmod",
        title: "Garry's Mod",
        detail: "Sandbox on gm_construct, 24 slots, no password.",
        steps: [
          "Open Garry's Mod.",
          "Press ~ to open the console and paste the connect command from the Garry's Mod card.",
          "Or add gmod.flintandsteelnetwork.com:61937 to Steam Favorites."
        ]
      },
      {
        id: "dayz",
        title: "DayZ",
        detail: "Vanilla PvP on Chernarus, 40 slots, no password.",
        steps: [
          "Open DayZ and choose Direct Connect, or add the address to Favorites.",
          "Use dayz.flintandsteelnetwork.com:32783. There is no password.",
          "Or search Flint and Steel Network | DayZ Vanilla in the in-game or Steam server browser."
        ]
      }
    ]
  },
  ranks: [
    {
      name: "Member",
      summary: "Granted on Discord verify."
    },
    {
      name: "Veteran",
      summary: "Automatic after 50 hours played: 400 claimed chunks and /fly.",
      highlight: true
    },
    {
      name: "VIP",
      summary: "Hand-picked by staff."
    },
    {
      name: "Moderator",
      summary: "Staff who help keep chat and the worlds fair."
    },
    {
      name: "Admin",
      summary: "Runs the network."
    }
  ],
  rulesIntro: "Play like someone else is building next to you.",
  rules: [
    "Be respectful. Harassment, slurs, and personal attacks are not welcome.",
    "No griefing and no stealing.",
    "No cheats, hacked clients, or x-ray.",
    "No lag machines or anything built to drag the server down.",
    "Keep chat friendly.",
    "Listen to staff."
  ]
};
