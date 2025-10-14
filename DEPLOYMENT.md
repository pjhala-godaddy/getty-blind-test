# Deployment Guide - This or That A/B Testing Tool

## Overview

This application has two parts that need to be deployed:
1. **Frontend**: React app → GitHub Pages (static hosting)
2. **Backend**: Node.js API → Separate hosting (Railway, Render, or AWS)

---

## Option 1: Quick Deploy (Recommended for Testing)

**Frontend**: GitHub Pages  
**Backend**: Railway.app (free tier, easiest)  
**Database**: Railway PostgreSQL (included)

### Step-by-Step:

#### 1. Create GitHub Repository

```bash
cd /Users/pjhala/this-or-that
git init
git add .
git commit -m "Initial commit: This or That A/B Testing Tool"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/this-or-that.git
git push -u origin main
```

#### 2. Deploy Backend to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `this-or-that` repository
5. Railway will auto-detect the backend
6. Add PostgreSQL database:
   - Click "+ New" → "Database" → "Add PostgreSQL"
7. Set environment variables:
   - `PORT` = 3001
   - `DATABASE_URL` = (automatically set by Railway)
   - `NODE_ENV` = production
8. Update start command in Railway settings:
   - Root directory: `backend`
   - Build command: `npm install && npm run build && npm run db:setup`
   - Start command: `npm start`
9. Copy the Railway URL (e.g., `https://your-app.railway.app`)

#### 3. Deploy Frontend to GitHub Pages

```bash
cd /Users/pjhala/this-or-that/frontend

# Update API URL to your Railway backend
echo "VITE_API_URL=https://your-app.railway.app/api" > .env.production

# Install gh-pages
npm install --save-dev gh-pages

# Add deployment scripts to package.json
```

Add to `frontend/package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/this-or-that"
}
```

```bash
# Deploy
npm run deploy
```

#### 4. Configure GitHub Pages

1. Go to your GitHub repo → Settings → Pages
2. Source: Deploy from branch `gh-pages`
3. Wait 1-2 minutes
4. Visit: `https://YOUR_USERNAME.github.io/this-or-that`

---

## Option 2: Production Deploy (AWS)

**Frontend**: GitHub Pages or S3 + CloudFront  
**Backend**: AWS Lambda + API Gateway  
**Database**: AWS RDS PostgreSQL

### Architecture:
```
GitHub Pages (Frontend)
    ↓ API calls
API Gateway → Lambda (Backend)
    ↓ Database queries
RDS PostgreSQL
```

### AWS Lambda Deployment:

1. **Prepare backend for Lambda**:

```bash
cd /Users/pjhala/this-or-that/backend
npm install serverless serverless-offline
```

Create `backend/serverless.yml`:
```yaml
service: this-or-that-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-west-2
  environment:
    DATABASE_URL: ${env:DATABASE_URL}

functions:
  api:
    handler: src/lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
```

Create `backend/src/lambda.ts`:
```typescript
import serverless from 'serverless-http';
import app from './server'; // Your Express app

export const handler = serverless(app);
```

2. **Deploy to AWS**:
```bash
serverless deploy
```

3. **Update frontend with Lambda URL**:
```bash
cd /Users/pjhala/this-or-that/frontend
echo "VITE_API_URL=https://YOUR_API_ID.execute-api.us-west-2.amazonaws.com/dev/api" > .env.production
npm run deploy
```

---

## Option 3: All-in-One (Vercel/Netlify)

**Both Frontend & Backend**: Vercel or Netlify  
**Database**: Vercel Postgres or external PostgreSQL

### Vercel Deployment:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Create `vercel.json` at project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "backend/src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

3. Deploy:
```bash
cd /Users/pjhala/this-or-that
vercel
```

---

## Database Migration (SQLite → PostgreSQL)

Since we're using SQLite locally, you'll need PostgreSQL for production:

### 1. Update backend for PostgreSQL:

```bash
cd /Users/pjhala/this-or-that/backend
npm uninstall better-sqlite3
npm install pg
```

### 2. Update connection code (already done in earlier version)

The PostgreSQL version is already in the repo history - we can revert the SQLite changes.

### 3. Run migrations:
```bash
# On Railway/AWS, this runs automatically
npm run db:setup
```

---

## GitHub Actions CI/CD (Automated Deployment)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install frontend dependencies
      working-directory: ./frontend
      run: npm install
    
    - name: Build frontend
      working-directory: ./frontend
      env:
        VITE_API_URL: ${{ secrets.API_URL }}
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./frontend/dist
```

Add API_URL to GitHub Secrets:
1. Repo → Settings → Secrets → Actions
2. Add `API_URL` = your backend URL

---

## Environment Variables Summary

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (Railway/AWS)
```
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NODE_ENV=production
```

---

## Testing Deployment

### 1. Test Backend:
```bash
curl https://your-backend-url.com/health
```

Expected: `{"status":"ok","timestamp":"..."}`

### 2. Test Frontend:
1. Visit your GitHub Pages URL
2. Enter your name
3. Click "Start Reviewing"
4. Check browser console for errors

### 3. Test Full Flow:
1. Complete 2-3 reviews
2. Click "View Analytics"
3. Verify data is saved
4. Open in incognito with different name
5. Verify multi-reviewer works

---

## Cost Estimates

### Railway (Recommended for Testing):
- Free tier: $5 credit/month
- Hobby plan: $5/month
- PostgreSQL included
- Auto-deploy on git push

### AWS:
- Lambda: ~$0 (free tier 1M requests/month)
- API Gateway: ~$3.50/million requests
- RDS PostgreSQL: ~$13/month (db.t3.micro)
- S3 + CloudFront: ~$1/month

### Vercel/Netlify:
- Free tier: Sufficient for internal tools
- Pro: $20/month if needed

---

## Recommended: Railway + GitHub Pages

**Why?**
- Easiest setup (5 minutes)
- Free for testing
- Auto-deploy on git push
- PostgreSQL included
- Good for internal tools

**Setup Time**: ~15 minutes  
**Monthly Cost**: $0-5

---

## Quick Start Commands

```bash
# 1. Create GitHub repo
cd /Users/pjhala/this-or-that
git init
git add .
git commit -m "Initial commit"
git branch -M main
# Add remote and push (after creating repo on GitHub)

# 2. Deploy backend to Railway
# (Use Railway website - connect GitHub repo)

# 3. Deploy frontend to GitHub Pages
cd frontend
echo "VITE_API_URL=https://YOUR-RAILWAY-URL.railway.app/api" > .env.production
npm install --save-dev gh-pages
# Add scripts to package.json
npm run deploy
```

---

## Troubleshooting

### Issue: API calls failing (CORS)
**Fix**: Check backend CORS settings allow your GitHub Pages domain

### Issue: Images not loading
**Fix**: Ensure image URLs are publicly accessible (GoDaddy CDN should work)

### Issue: Database connection error
**Fix**: Verify DATABASE_URL in backend environment variables

### Issue: 404 on GitHub Pages
**Fix**: Add `basename` to React Router or create `404.html` redirect

---

## Next Steps After Deployment

1. Share the GitHub Pages URL with your team
2. Monitor Railway logs for errors
3. Set up Sentry for error tracking (optional)
4. Add Google Analytics (optional)
5. Schedule regular database backups

---

**Ready to deploy?** Start with Railway + GitHub Pages for the easiest path!

