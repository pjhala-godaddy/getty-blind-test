# Quick Start Guide

Get the A/B Testing tool running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running

## Step 1: Database Setup

```bash
# Create the database
createdb thisorthat

# Set up the schema
cd backend
npm install
npm run db:setup
```

## Step 2: Start Backend

```bash
# In the backend directory
npm run dev
```

Backend will run on `http://localhost:3001`

## Step 3: Start Frontend

```bash
# In a new terminal, from the frontend directory
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 4: Try It Out!

1. Open `http://localhost:3000`
2. Enter your name (e.g., "Alex")
3. Enter a session name (e.g., "Test Session")
4. Click "Use Sample Data"
5. Start reviewing by clicking images or pressing A/B keys!

## Testing Multi-Reviewer

1. Complete a few reviews as one user
2. Open a new incognito/private browser window
3. Navigate to the same session with a different name
4. Review the same businesses
5. View analytics to see aggregated results

## Uploading Your Own Data

Create a CSV file with these columns:
- Business Name (required)
- Image URL A (required)
- Image URL B (required)
- Description, Industry, Content Style, Writing Style (optional)

See `sample-data.csv` for an example.

## Troubleshooting

**Database connection error:**
```bash
# Make sure PostgreSQL is running
pg_isready

# Check if database exists
psql -l | grep thisorthat
```

**Port already in use:**
```bash
# Change PORT in backend/.env
# Change server.port in frontend/vite.config.ts
```

**Images not loading:**
- Ensure image URLs are publicly accessible
- Check browser console for errors
- Try the sample data first to verify setup

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the styles in `frontend/src/styles/`
- Deploy to your preferred hosting platform
- Add authentication if needed

Happy testing! 🎉

