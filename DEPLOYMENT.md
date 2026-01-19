# 🚀 Deployment Guide for Lumitools

This guide will help you deploy Lumitools to various hosting platforms.

## 📋 Prerequisites

1. **GitHub Repository**: You need to create a GitHub repository first
2. **Built Project**: Make sure your project builds successfully (`npm run build`)

---

## 📦 Step 1: Create GitHub Repository

### Options when creating the repository:

1. **Repository name**: `lumitools` (or any name you prefer)

2. **Description**: 
   ```
   A high-performance, privacy-focused suite of online utilities for developers and creators
   ```

3. **Visibility**:
   - ✅ **Public** (recommended for portfolio/showcase)
   - ❌ Private (if you want to keep it private)

4. **Initialize repository options**:
   - ❌ **DO NOT** check "Add a README file" (you already have one)
   - ❌ **DO NOT** check "Add .gitignore" (you already have one)
   - ❌ **DO NOT** check "Choose a license" (we'll add one later if needed)

5. Click **"Create repository"**

### Then in your terminal:

```bash
# Navigate to your project directory
cd lumitools---ultimate-online-utilities

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Lumitools - Ultimate Online Utilities"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/lumitools.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 Step 2: Deploy to Hosting Platform

### Option A: Vercel (⭐ Recommended - Easiest & Fastest)

**Why Vercel?**
- ✅ Automatic deployments on every push
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Zero configuration needed
- ✅ Perfect for React/Vite projects

**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"Add New..."** → **"Project"**
4. Import your GitHub repository (`lumitools`)
5. Vercel will auto-detect it's a Vite project
6. **Build Settings** (should be auto-filled):
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
7. Click **"Deploy"**
8. Wait ~2 minutes and your site will be live!

**Your site URL will be:** `https://lumitools.vercel.app` (or a custom domain you set)

---

### Option B: Netlify

**Why Netlify?**
- ✅ Free tier with generous limits
- ✅ Automatic deployments
- ✅ Free SSL
- ✅ Form handling (if needed later)

**Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Select your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**

**Your site URL will be:** `https://random-name.netlify.app`

---

### Option C: GitHub Pages

**Note:** Requires additional configuration for React Router (SPA routing)

**Steps:**
1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/lumitools"
}
```

3. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/lumitools/',
  // ... rest of config
});
```

4. Deploy:
```bash
npm run deploy
```

5. Go to repository Settings → Pages → Select "gh-pages" branch → Save

---

## ✅ Post-Deployment Checklist

- [ ] Test all tools work correctly
- [ ] Verify dark mode works
- [ ] Check mobile responsiveness
- [ ] Test PWA functionality (service worker)
- [ ] Verify all routes work (especially category pages)
- [ ] Test file upload/download features
- [ ] Check console for errors

---

## 🔧 Troubleshooting

### Build fails on deployment platform:
- Make sure `package.json` has all dependencies
- Check Node.js version (should be 18+)
- Review build logs for specific errors

### Routes return 404:
- For Vercel/Netlify: Create `vercel.json` or `netlify.toml` with redirect rules
- For GitHub Pages: Make sure `base` is set correctly in `vite.config.ts`

### Assets not loading:
- Check that `base` path in `vite.config.ts` matches your deployment URL
- Verify `dist` folder is being deployed correctly

---

## 📊 Recommended Setup

**Best Choice:** Vercel
- Zero configuration
- Fastest deployment
- Best developer experience
- Free SSL and CDN included

Your deployment should be live in under 5 minutes! 🎉

