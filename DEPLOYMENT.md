# Deploy SERO HOSTEL & RENTAL

Two hosts, one codebase:

| Host | Address |
| --- | --- |
| GitHub Pages | https://tonny-uict.github.io/sero-hostel/ |
| Vercel | https://sero-hostel.vercel.app |

The site uses only relative paths, so it works both at a domain root (Vercel)
and under a subfolder (GitHub Pages project site). `.nojekyll` is already
present, so GitHub Pages serves the `fonts/` and `images/` folders as-is.

## 0. One-time setup on this machine

```bash
gh auth login          # sign in as tonny-uict
vercel login           # sign in with the same GitHub account
```

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

`vercel.json` already sets `cleanUrls`, `trailingSlash: false` and long-lived
cache headers for `images/` and `fonts/`.

```bash
vercel link --project sero-hostel
vercel --prod
```

- `vercel link --project sero-hostel` fixes the project name, which is what
  produces `sero-hostel.vercel.app`. Deploying without it would name the
  project after the folder (`sero-hostel-website-v2`).
- The `.vercel.app` name is only free if no other account owns it. If Vercel
  says it is taken, pick `sero-hostel-ug` or add a custom domain.
- For automatic deploys on push, import the GitHub repo in the Vercel
  dashboard instead: **Add New -> Project -> sero-hostel**.

## Before launch

- Confirm room prices, deposits, occupancy and availability.
- Confirm how male and female accommodation is arranged.
- Confirm the precise property address or map pin. The map link on the website points to the general Banda area only.
- Confirm which phone numbers accept WhatsApp. The WhatsApp buttons open the first number (`WHATSAPP_NUMBER` in `script.js`).
- Set `og:image` in `index.html` to the full address of `images/og.jpg` so link previews show the photo.
- Check the site on a phone after deployment, including the map and the Plan your stay button.
