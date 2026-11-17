# Flint and Steel Network

Static site for the Flint and Steel community. It is plain HTML, CSS, and JavaScript. There is no backend, no secrets, and no analytics.

The live site is intended for [https://clayton251.github.io/flintandsteel/](https://clayton251.github.io/flintandsteel/). Asset links are relative, so the same files also work at the root of a custom domain.

## Edit the site

Change servers, the Cobblemon placeholder, join steps, ranks, rules, and vote links in [`config.js`](config.js).

The Cobblemon hostname is marked `addressConfirmed: false` until it is confirmed. Minecraft addresses in that file are public hostnames only. Do not add LAN IPs, internal hostnames, or ports. The two public map links are the exception already listed there.

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

Live Minecraft status is loaded in the browser from `https://api.mcstatus.io`. The page does not request the HTTP map links.

## GitHub Pages

Workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml). It publishes on every push to `main`.

After this workflow is on `main`:

1. Open **Settings → Pages** for this repository: <https://github.com/clayton251/flintandsteel/settings/pages>
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. That choice is applied when you select it. The current Pages form has no separate Save button.
4. If the deploy that ran when the workflow landed on `main` failed because Pages was still off, open the **Actions** tab, select **Deploy static content to Pages**, and choose **Re-run all jobs**. You can also use **Run workflow** on that workflow.

A green run serves <https://clayton251.github.io/flintandsteel/>.

If a run fails with a token permissions error, open **Settings → Actions → General → Workflow permissions**, choose **Read and write permissions**, save, and re-run the workflow.

A custom apex domain is **Settings → Pages → Custom domain** later. No path rewrite is required in the site files.

Fonts are Press Start 2P, Russo One, and Source Sans 3, under the SIL Open Font License. See [`fonts/OFL.txt`](fonts/OFL.txt).
