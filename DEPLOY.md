# Deploy

The site is a static Astro build. GitHub Actions builds it and GitHub Pages serves `dist/`. The canonical site is `https://weekinomarchy.com` (`site` in `astro.config.mjs`). `public/CNAME` is `weekinomarchy.com`, and Astro copies it into `dist/`.

## What GitHub Actions does

`.github/workflows/deploy.yml` runs on every push to `main`, and when someone starts it by hand.

1. `npm ci && npm run build`
2. `actions/upload-pages-artifact` uploads `dist/`
3. `actions/deploy-pages` deploys that artifact

The workflow uses the `github-pages` environment. GitHub creates that environment when Pages is set to GitHub Actions.

The upload and deploy actions are pinned to v4. The v5 upload action writes artifacts with `actions/upload-artifact` v7, and `actions/deploy-pages` v5 has shipped sites that did not pick those artifacts up.

## What Tom does in the repository

Repository **Settings → Pages**:

1. Open **Settings**, then **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Leave the branch selector unused. Pages reads the artifact from the workflow, not a `gh-pages` branch.
4. After the first successful **Deploy to GitHub Pages** run, the Pages settings show a URL. Custom domain `weekinomarchy.com` comes from the `CNAME` file in the artifact. If the field is empty, enter `weekinomarchy.com` and save. Enforce HTTPS after the certificate is issued.

The workflow’s `github-pages` environment may ask for approval the first time. Approve it in **Settings → Environments → github-pages** if the deploy job waits.

## GoDaddy DNS

In the GoDaddy DNS panel for `weekinomarchy.com`, remove conflicting A, AAAA, and CNAME records on the same hosts, then add:

Apex (`@`):

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

`www`:

| Type | Host | Value |
| --- | --- | --- |
| CNAME | `www` | `tcballard.github.io` |

GitHub’s Pages apex addresses are those four A records. The `www` name points at the GitHub Pages host for the `tcballard` account, `tcballard.github.io`.

DNS can take a while to settle. `https://weekinomarchy.com` answers after the A records propagate and GitHub has issued the certificate.
