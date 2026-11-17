/* Flint and Steel Network — site config.
   The words players and search engines see are in index.html.
   When you change an address, vote link, or description, update both files.
   Use public hostnames only. Do not add LAN IPs, internal hostnames, or ports.

   Join addresses are the public SRV names. Do not add a port.
   Live maps and the public status page are HTTPS hosts with no extra path.
   Link the status page only as https://status.flintandsteelnetwork.com.

   Vote links use each site's vote page when that page has its own URL.
   Modded Minecraft Servers and TopG put the vote form on the listing, at #vote. */
window.FNS_CONFIG = {
  name: "Flint and Steel Network",
  tagline: "Strike a spark. Stay for the build.",
  about: "A veteran-run Minecraft and game server network.",
  lede: "All the Mods 10, Create: Above and Beyond, Cobblemon, an open vanilla world, a Valheim crossplay server, and a Palworld PvE server.",
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
      id: "cobblemon",
      name: "Cobblemon",
      code: "COBBLEMON",
      game: "minecraft",
      platform: "Pokemon modpack",
      blurb: "Pokemon modpack with a Pokemon-center themed spawn. Whitelisted through Discord.",
      address: "cobblemon.flintandsteelnetwork.com",
      addressConfirmed: true,
      access: "Discord whitelist",
      votes: [
        {
          label: "Modded Minecraft Servers",
          url: "https://moddedminecraftservers.com/server/flint-and-steel-network-cobblemon.61132/#vote"
        },
        { label: "Minecraft MP", url: "https://minecraft-mp.com/server/367006/vote/" },
        { label: "FTB Servers", url: "https://ftbservers.com/server/EB8QvcZO/vote" },
        { label: "MinecraftServers.org", url: "https://minecraftservers.org/vote/696287" },
        { label: "TopG", url: "https://topg.org/minecraft-servers/server-688624#vote" },
        { label: "Minecraft Server List", url: "https://minecraft-server-list.com/server/525043/vote/" }
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
    }
  ],
  join: {
    intro: "Modded servers need the matching CurseForge pack and a Discord whitelist. Vanilla is just the address. Valheim is the join code. Palworld is in the community server list.",
    tracks: [
      {
        id: "modded",
        title: "Modded servers",
        detail: "All the Mods 10, Create: Above and Beyond, and Cobblemon.",
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
        ],
        note: "For Cobblemon, install the pack named in Discord so your mods match the server."
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
