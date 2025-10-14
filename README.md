# Getty Blind Test - A/B Testing Tool

A web-based A/B testing interface for evaluating AI-generated website designs. This tool allows multiple reviewers at GoDaddy to compare outputs from different AI prompting strategies for the Website Agent (WSBA) product.

## Features

- 📊 **56 Real Test Cases**: Pre-loaded with actual GoDaddy WSBA website designs
- 🖼️ **Side-by-Side Comparison**: Scrollable image containers for full-length website screenshots
- 💬 **Comment Collection**: Optional comments for each option to capture detailed feedback
- 👥 **Multi-Reviewer Support**: Multiple users can independently evaluate the same dataset
- 📈 **Analytics Dashboard**: View aggregated results, preferences, and comment themes
- 💾 **Session Persistence**: Resume reviews if you refresh or return later
- ⌨️ **Keyboard Shortcuts**: Quick navigation with A/B/Arrow keys
- 📥 **CSV Export**: Export full results for further analysis

## Quick Start

### Prerequisites

- Node.js 18+
- Running locally (no PostgreSQL needed - uses SQLite)

### Setup

```bash
# Backend
cd backend
npm install
npm run db:setup
npm run dev  # Runs on http://localhost:3001

# Frontend (in new terminal)
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

### Usage

1. Open http://localhost:3000
2. Enter your name
3. Click "Start Reviewing"
4. Review the 56 website designs:
   - Click images or press `A`/`B` to select
   - Add comments (optional)
   - Use arrow keys to navigate
5. View analytics to see team preferences

## Deployment

See `QUICKDEPLOY.md` for deploying to Railway + GitHub Pages.

## Tech Stack

**Frontend**: React 18 + TypeScript + Vite  
**Backend**: Node.js + Express + TypeScript  
**Database**: SQLite (local) / PostgreSQL (production)

## Project Structure

```
getty-blind-test/
├── frontend/          # React application
├── backend/           # Express API
├── QUICKDEPLOY.md    # 10-minute deployment guide
├── DEPLOYMENT.md     # Comprehensive deployment docs
└── real-data.csv     # 56 test businesses
```

## Documentation

- `QUICKDEPLOY.md` - Fast deployment guide (10 min)
- `DEPLOYMENT.md` - Complete deployment options
- `TESTING_GUIDE.md` - Local testing scenarios
- `PROJECT_SUMMARY.md` - Implementation details

## Success Metrics

- ✅ 56 businesses ready to review
- ✅ Multi-reviewer support with attribution
- ✅ Real-time analytics dashboard
- ✅ Comment grouping for theme analysis
- ✅ CSV export functionality
- ✅ Session persistence
- ✅ Keyboard shortcuts for efficiency

---

Built for GoDaddy's Website Agent (WSBA) prompt testing.
