#!/bin/bash

# This or That - Quick Deployment Script

echo "🚀 This or That - Deployment Helper"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "Choose deployment option:"
echo "1. GitHub Pages (Frontend only - need backend URL)"
echo "2. Setup GitHub repo (first time)"
echo "3. Both - Setup repo + Deploy frontend"
echo ""
read -p "Enter option (1-3): " option

case $option in
    1)
        echo ""
        echo "📦 Deploying Frontend to GitHub Pages..."
        echo ""
        read -p "Enter your backend API URL (e.g., https://xxx.railway.app/api): " api_url
        
        cd frontend
        echo "VITE_API_URL=$api_url" > .env.production
        
        # Check if gh-pages is installed
        if ! grep -q "gh-pages" package.json; then
            echo "📥 Installing gh-pages..."
            npm install --save-dev gh-pages
            
            # Update package.json with deploy scripts
            echo "✏️  Adding deploy scripts to package.json..."
            # Note: This requires manual edit or use jq
            echo "⚠️  Please manually add these scripts to frontend/package.json:"
            echo '  "predeploy": "npm run build",'
            echo '  "deploy": "gh-pages -d dist",'
            echo '  "homepage": "https://YOUR_USERNAME.github.io/this-or-that"'
            echo ""
            read -p "Press Enter after updating package.json..."
        fi
        
        npm run deploy
        echo ""
        echo "✅ Frontend deployed!"
        echo "📍 Visit: https://YOUR_USERNAME.github.io/this-or-that"
        ;;
        
    2)
        echo ""
        echo "📝 Setting up GitHub repository..."
        echo ""
        cd ..
        git init
        git add .
        git commit -m "Initial commit: This or That A/B Testing Tool"
        git branch -M main
        
        echo ""
        echo "✅ Git repository initialized!"
        echo ""
        echo "Next steps:"
        echo "1. Create a new repository on GitHub"
        echo "2. Run these commands:"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/this-or-that.git"
        echo "   git push -u origin main"
        ;;
        
    3)
        echo ""
        echo "📝 Setting up GitHub repo and deploying..."
        echo ""
        
        # Setup repo
        cd /Users/pjhala/this-or-that
        git init
        git add .
        git commit -m "Initial commit: This or That A/B Testing Tool"
        git branch -M main
        
        echo ""
        echo "⚠️  Now:"
        echo "1. Create a new repository on GitHub named 'this-or-that'"
        echo "2. Copy your repository URL"
        echo ""
        read -p "Enter your GitHub repository URL: " repo_url
        
        git remote add origin "$repo_url"
        git push -u origin main
        
        echo ""
        echo "✅ Code pushed to GitHub!"
        echo ""
        echo "Next steps:"
        echo "1. Deploy backend to Railway:"
        echo "   - Go to https://railway.app"
        echo "   - New Project → Deploy from GitHub"
        echo "   - Add PostgreSQL database"
        echo "   - Copy your Railway URL"
        echo ""
        read -p "Enter your Railway backend URL (e.g., https://xxx.railway.app/api): " api_url
        
        cd frontend
        echo "VITE_API_URL=$api_url" > .env.production
        
        npm install --save-dev gh-pages
        echo ""
        echo "⚠️  Please manually add to frontend/package.json:"
        echo '  "predeploy": "npm run build",'
        echo '  "deploy": "gh-pages -d dist",'
        echo '  "homepage": "https://YOUR_USERNAME.github.io/this-or-that"'
        echo ""
        read -p "Press Enter after updating package.json..."
        
        npm run deploy
        
        echo ""
        echo "🎉 Deployment complete!"
        echo "📍 Frontend: https://YOUR_USERNAME.github.io/this-or-that"
        echo "📍 Backend: $api_url"
        ;;
        
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✨ Done!"

