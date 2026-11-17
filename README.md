# Flint and Steel Network

Static site for the Flint and Steel community. It is plain HTML, CSS, and JavaScript. There is no backend, no account, and no tracker.

Production URL: <https://clayton251.github.io/flintandsteel/>

## Edit the site

All servers, join steps, ranks, rules, vote links, the Discord invite, and the “coming soon” line live in [`config.js`](config.js).

- Minecraft cards ping `https://api.mcstatus.io/v2/status/java/<address>` from the visitor’s browser.
- Valheim does not get a status check. It shows the join code.
- Vote buttons use each site’s vote page when that URL is a stable path. Modded Minecraft Servers and TopG take the vote on the listing itself, so those buttons open the listing.
- Keep addresses as the public hostnames. Do not put LAN IPs, home hostnames, or private ports in this repo. The live-map links already in `config.js` are the only non-HTTPS URLs, and they are normal links, not fetches.

Cobblemon’s public address is `cobblemon.flintandsteel.playit.plus`. A status check answered, and the server’s message identified it as Flint and Steel Cobblemon. Change that one string in `config.js` if the hostname moves.

## Preview locally on the Pages subpath

Relative asset paths are used on purpose, so the site works at `/flintandsteel/` the same way it will on GitHub Pages.

```bash
# from the parent of this repo
python3 -m http.server 8080
```

Open <http://127.0.0.1:8080/flintandsteel/>.

Serving this folder itself (`python3 -m http.server` inside the repo) also works, at `/`.

## GitHub Pages

The workflow is [`.github/workflows/pages.yml`](.github/workflows/pages.yml). It runs on every push to `main` and publishes the site with GitHub Actions. It does not deploy the README.

Pages is not automatic until the repository source is set:

1. Merge the site to `main`.
2. Open **Settings → Pages**: <https://github.com/clayton251/flintandsteel/settings/pages>
3. Under **Build and deployment**, set **Source** to **GitHub Actions**. Do not choose “Deploy from a branch”.
4. If a Save button is shown, click **Save**. Choosing GitHub Actions often applies immediately.
5. Open the **Actions** tab and confirm **Deploy GitHub Pages** is green. If the first run failed because the source was still unset, use **Re-run jobs** after step 3.

The site then answers at <https://clayton251.github.io/flintandsteel/>.

## Fonts

Outfit and Pixelify Sans are self-hosted in `assets/fonts/` under the SIL Open Font License. License texts are in that folder. No requests are made to Google Fonts, and the page does not load analytics.
