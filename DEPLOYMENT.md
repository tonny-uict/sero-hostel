# Deploy SERO HOSTEL & RENTAL

Two hosts, one codebase:

| Host | Address |
| --- | --- |
| GitHub Pages | https://tonny-uict.github.io/sero-hostel/ |
| Vercel | https://sero-hostel.vercel.app |

The site uses only relative paths, so it works both at a domain root (Vercel)
and under a subfolder (GitHub Pages project site). `.nojekyll` is already
present, so GitHub Pages serves the `fonts/` and `images/` folders as-is.

## 0. Status

Both hosts are live and deploy on every push to `main`:

- GitHub Pages rebuilds from the `main` branch automatically.
- Vercel deploys through `.github/workflows/deploy.yml` (GitHub Actions).
  The `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` repository
  secrets are already set. The token is project-scoped to `sero-hostel`.

No manual step is needed after `git push`.

## 1. GitHub repository + Pages

The repository is already committed locally on branch `main`.

```bash
gh repo create tonny-uict/sero-hostel --public --source=. --remote=origin --push
gh api -X POST repos/tonny-uict/sero-hostel/pages \
  -f 'source[branch]=main' -f 'source[path]=/'
```

- The repository must be **public** for Pages on a free account.
- Pages URL: `https://tonny-uict.github.io/sero-hostel/`
- First build takes a minute or two. Check with:
  `gh api repos/tonny-uict/sero-hostel/pages --jq .status`

To ship later changes:

```bash
git add -A && git commit -m "Update" && git push
```

GitHub Pages redeploys automatically on every push to `main`.

## 2. Vercel

`vercel.json` sets `cleanUrls`, `trailingSlash: false` and long-lived cache
headers for `images/` and `fonts/`.

Deployment is automatic: pushing to `main` runs
`.github/workflows/deploy.yml`, which deploys production and moves the
`sero-hostel.vercel.app` alias. Check it with:

```bash
gh run list --workflow=deploy.yml
```

Manual deploy, if ever needed:

```bash
vercel --prod
```

- `sero-hostel.vercel.app` is produced by the project name `sero-hostel`.
- To rename the project, use `vercel link --project <new-name>` and update the
  `VERCEL_PROJECT_ID` secret.
- The token in `VERCEL_TOKEN` is project-scoped. If it is rotated in the Vercel
  dashboard, update the secret:
  `gh secret set VERCEL_TOKEN -R tonny-uict/sero-hostel`

## Before launch

- Confirm room prices, deposits, occupancy and availability.
- Confirm how male and female accommodation is arranged.
- Confirm the precise property address or map pin. The map link on the website points to the general Banda area only.
- Confirm which phone numbers accept WhatsApp. The WhatsApp buttons open the first number (`WHATSAPP_NUMBER` in `script.js`).
- Set `og:image` in `index.html` to the full address of `images/og.jpg` so link previews show the photo.
- Check the site on a phone after deployment, including the map and the Plan your stay button.
