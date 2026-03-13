# Deployment Guide

## GitHub Pages Deployment

### Prerequisites
- GitHub account
- Git installed locally
- Repository created on GitHub

### Step-by-Step Deployment

#### 1. Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Productivity Dashboard"
```

#### 2. Add Remote Repository

```bash
git remote add origin https://github.com/yourusername/productivity-dashboard.git
git branch -M main
git push -u origin main
```

Replace `yourusername` with your actual GitHub username.

#### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (gear icon)
3. Scroll down to **Pages** section
4. Under "Build and deployment":
   - Source: Select "Deploy from a branch"
   - Branch: Select "main"
   - Folder: Select "/" (root)
5. Click **Save**

#### 4. Wait for Deployment

GitHub will automatically deploy your site. You'll see a green checkmark when complete.

Your site will be available at: `https://yourusername.github.io/productivity-dashboard`

### Automatic Deployment

The `.github/workflows/deploy.yml` file automatically deploys your site whenever you push to the main branch.

To deploy updates:
```bash
git add .
git commit -m "Update: Description of changes"
git push origin main
```

The site will update automatically within a few minutes.

## Custom Domain (Optional)

### Using a Custom Domain

1. **Purchase a domain** from a domain registrar (GoDaddy, Namecheap, etc.)

2. **Configure DNS records**:
   - Add an `A` record pointing to GitHub Pages IP: `185.199.108.153`
   - Or add a `CNAME` record pointing to `yourusername.github.io`

3. **Update repository settings**:
   - Go to Settings → Pages
   - Under "Custom domain", enter your domain name
   - Click **Save**
   - GitHub will create a `CNAME` file automatically

4. **Update workflow file** (optional):
   - Edit `.github/workflows/deploy.yml`
   - Update the `cname` field with your domain

### Example DNS Configuration

For domain `productivity.example.com`:

**Option 1: A Record**
```
Type: A
Name: productivity
Value: 185.199.108.153
```

**Option 2: CNAME Record**
```
Type: CNAME
Name: productivity
Value: yourusername.github.io
```

## Troubleshooting

### Site Not Deploying

1. Check GitHub Actions:
   - Go to **Actions** tab
   - Look for failed workflows
   - Click on failed workflow to see error details

2. Verify settings:
   - Ensure Pages is enabled in Settings
   - Check that branch is set to "main"
   - Verify folder is set to "/" (root)

3. Clear cache:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito/private window

### Custom Domain Not Working

1. Verify DNS records are correct:
   - Use `nslookup` or `dig` to check DNS:
   ```bash
   nslookup productivity.example.com
   dig productivity.example.com
   ```

2. Wait for DNS propagation:
   - DNS changes can take 24-48 hours to propagate
   - Use https://www.whatsmydns.net/ to check propagation

3. Check CNAME file:
   - GitHub should create a `CNAME` file automatically
   - If not, create it manually in the root directory with your domain name

## Local Testing Before Deployment

### Test Locally with Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Visit `http://localhost:8000` in your browser.

### Test Locally with Node.js

```bash
# Using http-server
npx http-server

# Using serve
npx serve
```

## Updating Your Site

### Making Changes

1. Edit files locally
2. Test in browser
3. Commit changes:
   ```bash
   git add .
   git commit -m "Update: Description"
   ```
4. Push to GitHub:
   ```bash
   git push origin main
   ```

The site will automatically update within a few minutes.

### Rollback Changes

If you need to revert to a previous version:

```bash
# View commit history
git log --oneline

# Revert to specific commit
git revert <commit-hash>
git push origin main
```

## Performance Optimization

### Minification (Optional)

For production, you can minify CSS and JavaScript:

```bash
# Install minifiers
npm install -g csso-cli terser

# Minify CSS
csso css/styles.css -o css/styles.min.css

# Minify JavaScript
terser js/app.js -o js/app.min.js
```

Then update `index.html` to use minified versions.

### Caching

GitHub Pages automatically sets cache headers. To force cache refresh:
- Add a query parameter: `?v=1.0.1`
- Update version in `package.json`

## Monitoring

### Check Deployment Status

1. Go to **Actions** tab in your repository
2. Look for "Deploy to GitHub Pages" workflow
3. Green checkmark = successful deployment
4. Red X = deployment failed

### View Deployment History

1. Go to **Deployments** tab
2. See all deployment history
3. Click on deployment to see details

## Support

For GitHub Pages issues:
- https://docs.github.com/en/pages
- https://github.com/peaceiris/actions-gh-pages

For domain/DNS issues:
- Contact your domain registrar
- Check DNS propagation: https://www.whatsmydns.net/

---

Your Productivity Dashboard is now ready to share with the world!
