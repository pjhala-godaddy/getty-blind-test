# Quick Deploy Guide

## 🚀 Deploy in 10 Minutes

### Prerequisites
- GitHub account
- Railway account (free): https://railway.app

---

## Step 1: Deploy Backend to Railway (5 min)

1. **Go to Railway**: https://railway.app
2. **Sign in** with GitHub
3. **New Project** → "Deploy from GitHub repo"
4. **Select** your repo (or create it first - see below)
5. **Add Database**: 
   - Click "+ New" 
   - Select "Database" → "PostgreSQL"
6. **Configure**:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
7. **Copy URL**: Note your Railway URL (e.g., `https://this-or-that-production.up.railway.app`)

---

## Step 2: Deploy Frontend to GitHub Pages (5 min)

### First Time Setup:

```bash
cd /Users/pjhala/this-or-that

# If you haven't created the repo yet:
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/this-or-that.git
git push -u origin main
```

### Deploy Frontend:

```bash
cd frontend

# Set your backend URL
echo "VITE_API_URL=https://YOUR-RAILWAY-URL.railway.app/api" > .env.production

# Install gh-pages
npm install --save-dev gh-pages
```

**Update `frontend/package.json`** - add these lines:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/this-or-that",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

```bash
# Deploy!
npm run deploy
```

---

## Step 3: Enable GitHub Pages

1. Go to your repo on GitHub
2. **Settings** → **Pages**
3. **Source**: Deploy from branch
4. **Branch**: `gh-pages` → `/ (root)`
5. **Save**
6. Wait 1-2 minutes

---

## ✅ You're Done!

**Your app is live at:**
```
https://YOUR_USERNAME.github.io/this-or-that
```

---

## 🔄 To Update (After Changes):

### Backend:
```bash
git push
# Railway auto-deploys
```

### Frontend:
```bash
cd frontend
npm run deploy
```

---

## ⚡ Even Faster: Use the Script

```bash
cd /Users/pjhala/this-or-that
./deploy.sh
```

Follow the prompts!

---

## 🐛 Troubleshooting

**"API calls failing"**
- Check your `VITE_API_URL` in `.env.production`
- Verify Railway backend is running: `curl https://YOUR-URL.railway.app/health`

**"Images not loading"**
- Check browser console for CORS errors
- Images should load directly from GoDaddy CDN

**"Can't access database"**
- Verify PostgreSQL is added to Railway
- Check DATABASE_URL environment variable is set

---

## 💰 Cost

- **Railway**: Free $5 credit/month (sufficient for testing)
- **GitHub Pages**: Free
- **Total**: $0 for testing, ~$5/month for production

---

## 📝 URLs to Remember

- **Frontend**: https://YOUR_USERNAME.github.io/this-or-that
- **Backend**: https://YOUR-PROJECT.railway.app
- **Railway Dashboard**: https://railway.app/dashboard
- **GitHub Repo**: https://github.com/YOUR_USERNAME/this-or-that

---

**Need help?** Check DEPLOYMENT.md for detailed instructions!

