# Deploy SERO HOSTEL & RENTAL

## 1. Upload to GitHub

1. Download and extract this ZIP.
2. Create a new GitHub repository, for example `sero-hostel-rental`.
3. Upload the **contents** of this extracted folder to the repository root. Make sure `index.html` is directly at the top level.
4. Commit the files to the `main` branch.
5. Open the repository's **Settings -> Pages**.
6. Under **Build and deployment**, select **Deploy from a branch**.
7. Choose branch `main` and folder `/ (root)`, then save.
8. GitHub will provide the Pages website address after deployment.

## 2. Deploy the same repository to Vercel

1. Sign in to Vercel using your GitHub account.
2. Select **Add New -> Project** and import the `sero-hostel-rental` repository.
3. Choose **Other** as the framework preset.
4. Leave the build command blank; use `.` as the output directory if Vercel requests one.
5. Deploy. Vercel will assign a `*.vercel.app` address.
6. Future commits pushed to GitHub can trigger automatic Vercel deployments.

GitHub Pages and Vercel are separate hosting destinations. Importing the GitHub repository into Vercel is what creates the Vercel deployment and its `.vercel.app` address.

## Before launch

- Confirm room prices, deposits, occupancy and availability.
- Confirm how male and female accommodation is arranged.
- Confirm the precise property address or map pin. The map link on the website points to the general Banda area only.
- Confirm which phone numbers accept WhatsApp. The WhatsApp buttons open the first number (`WHATSAPP_NUMBER` in `script.js`).
- Set `og:image` in `index.html` to the full address of `images/og.jpg` so link previews show the photo.
- Check the site on a phone after deployment, including the map and the Plan your stay button.
