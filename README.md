# Arik Singh - Portfolio

This is the source code for my portfolio website.

## Project Structure

- `index.html`: The main homepage.
- `assets/css/`: Stylesheets.
- `assets/images/`: Project images.

## Deployment

### 1. Push to GitHub

To push the changes to your GitHub repository:

```bash
git add .
git commit -m "Initial portfolio website commit"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub: [https://github.com/ariksingh-dev/portfolio](https://github.com/ariksingh-dev/portfolio)
2. Go to **Settings** > **Pages**.
3. Under **Source**, select `Deploy from a branch`.
4. Under **Branch**, select `main` and `/(root)`.
5. Click **Save**.

Your website will be live at `https://ariksingh-dev.github.io/portfolio/`.



## Troubleshooting

If you see a **404 Error**:

1.  **Wait**: It can take up to 10 minutes for the site to go live after the first push.
2.  **Check Repository Settings**:
    - Go to **Settings** > **Pages** on GitHub.
    - Ensure **Source** is set to `Deploy from a branch`.
    - Ensure **Branch** is set to `main` and folder is `/(root)`.
    - Click **Save** (even if it looks correct, clicking save again can trigger a build).
3.  **Check Actions**:
    - Go to the **Actions** tab in your repository.
    - You should see a workflow running (e.g., "pages build and deployment").
    - If it failed, click on it to see the error.
