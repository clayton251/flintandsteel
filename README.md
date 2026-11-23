# Flint and Steel Network

Static site for the Flint and Steel community. It is plain HTML, CSS, and JavaScript. There is no backend, no secrets, and no analytics.

The public site is [https://flintandsteelnetwork.com/](https://flintandsteelnetwork.com/). Asset paths are relative, so the same files also work under [https://clayton251.github.io/flintandsteel/](https://clayton251.github.io/flintandsteel/) before the custom domain is enforced.

## Edit the site

Change servers, join steps, ranks, rules, and vote links in [`index.html`](index.html) and [`config.js`](config.js). The page text is in `index.html` so search engines can read it without JavaScript. Keep the addresses in both files the same.

Minecraft join addresses are the public SRV names on `flintandsteelnetwork.com`, with no port. Do not add LAN IPs or internal hostnames. Palworld publishes `palworld.flintandsteelnetwork.com:49096`. Counter-Strike 2 joins with the developer console command `connect cs2.flintandsteelnetwork.com:1740`. That hostname and port are the only CS2 address. 7 Days to Die uses `7dtd.flintandsteelnetwork.com:28246`. That hostname and port are the only 7 Days to Die address. Live maps are `https://map.flintandsteelnetwork.com` and `https://atm10map.flintandsteelnetwork.com`. The public status page is only `https://status.flintandsteelnetwork.com`, with no extra path.

The Discord invite in `config.js` is also written in the `noscript` block in `index.html`. Update both if the invite changes.

## Preview

From this folder, for a domain-root preview:

```bash
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/`.

For the GitHub project-page path, serve the parent folder while this repo is named `flintandsteel`:

```bash
cd ..
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/flintandsteel/`.

Live Minecraft status is loaded in the browser from `https://api.mcstatus.io`. The map and status pages are ordinary links. The site does not fetch them.

## GitHub Pages

Workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml). It publishes on every push to `main`.

After this workflow is on `main`:

1. Open **Settings → Pages** for this repository: <https://github.com/clayton251/flintandsteel/settings/pages>
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. That choice is applied when you select it. The current Pages form has no separate Save button.
4. If the deploy that ran when the workflow landed on `main` failed because Pages was still off, open the **Actions** tab, select **Deploy static content to Pages**, and choose **Re-run all jobs**. You can also use **Run workflow** on that workflow.

A green run serves <https://clayton251.github.io/flintandsteel/> until the custom domain is saved. After that, the site is <https://flintandsteelnetwork.com/>.

If a run fails with a token permissions error, open **Settings → Actions → General → Workflow permissions**, choose **Read and write permissions**, save, and re-run the workflow.

The published artifact includes a `CNAME` file containing `flintandsteelnetwork.com`. With a GitHub Actions source, that file is not enough on its own. On **Settings → Pages**, after Source is **GitHub Actions**:

1. Under **Custom domain**, enter `flintandsteelnetwork.com` (the apex only: no `https://`, no path, no `www`).
2. Click **Save**.
3. Wait until the DNS check for that domain succeeds. Leave the existing apex A records and the `www` CNAME as DNS-only.
4. When **Enforce HTTPS** becomes available, check it. GitHub leaves the box disabled until the certificate is issued, which is often a few minutes and can take up to a day. It saves when you check it.

`www.flintandsteelnetwork.com` should redirect to the apex once that certificate is active. Do not add a `<base>` tag.

Fonts are Press Start 2P, Russo One, and Source Sans 3, under the SIL Open Font License. See [`fonts/OFL.txt`](fonts/OFL.txt).
