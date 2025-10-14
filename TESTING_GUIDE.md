# 🧪 Testing Guide - This or That A/B Testing Tool

## ✅ Current Status

**Both servers are running!**

- 🟢 Backend: http://localhost:3001 
- 🟢 Frontend: http://localhost:3000
- 🟢 Database: SQLite at `/Users/pjhala/this-or-that/backend/data/thisorthat.db`

---

## 🎯 Test Scenario 1: Quick Sample Data Test (5 minutes)

### Step 1: Open the Application
1. Open your browser
2. Navigate to: **http://localhost:3000**

### Step 2: Create a Test Session
1. You should see the "This or That: Website Images" upload page
2. **Enter your name**: e.g., "Alex"
3. **Enter session name**: e.g., "My First Test"
4. Click **"Use Sample Data"** button

### Step 3: Review Images
1. You'll see the first business with two images (Option A and Option B)
2. **Test clicking**: Click on one of the images to select it
3. **Test keyboard**: Press `A` or `B` key to select
4. **Add comments** (optional): Type in the comment boxes
5. Click **"Submit and Next →"** to go to the next business

### Step 4: Navigate Through Reviews
- Use **"← Previous"** button to go back
- Use **Arrow keys** (← →) for keyboard navigation
- Complete at least 3-5 reviews

### Step 5: View Analytics
1. Click **"View Analytics"** button at the top
2. You should see:
   - Summary cards (total businesses, reviews, reviewers)
   - Overall preference chart (A vs B percentages)
   - Per-business results table
   - Your comments grouped by option

### Step 6: Export Results
1. On the analytics page, click **"Export Results (CSV)"**
2. A CSV file will download with all your review data

---

## 🎯 Test Scenario 2: Multi-Reviewer Testing (10 minutes)

This tests that multiple people can review the same dataset independently.

### Part A: First Reviewer
1. Complete 5-10 reviews as "Reviewer 1" (using the steps above)
2. Note the session URL: `http://localhost:3000/review/{sessionId}`

### Part B: Second Reviewer
1. Open an **incognito/private browser window**
2. Navigate to the same URL: `http://localhost:3000/review/{sessionId}?reviewer=Reviewer2`
3. Complete reviews as "Reviewer 2"

### Part C: View Combined Analytics
1. Go to analytics: `http://localhost:3000/analytics/{sessionId}`
2. You should see:
   - Both reviewers listed in "Reviewer Participation"
   - Combined votes for each business
   - Overall preference reflects both reviewers' choices

---

## 🎯 Test Scenario 3: Upload Your Own Data

### Step 1: Prepare Your CSV File

Create a file named `my-test-data.csv` with this structure:

```csv
Business Name,Description,Industry,Content Style,Writing Style,Image URL A,Image URL B
"Test Business 1","Description here","Technology","Modern","Professional","https://via.placeholder.com/800x2400/3B82F6/ffffff?text=A1","https://via.placeholder.com/800x2400/10B981/ffffff?text=B1"
"Test Business 2","Description here","Retail","Bold","Casual","https://via.placeholder.com/800x2400/3B82F6/ffffff?text=A2","https://via.placeholder.com/800x2400/10B981/ffffff?text=B2"
```

### Step 2: Upload
1. Go to http://localhost:3000
2. Enter your name and session name
3. Click **"Upload Excel/CSV File"**
4. Select your `my-test-data.csv` file
5. Start reviewing!

**Note**: The sample `sample-data.csv` in the project root has 10 example businesses you can also use.

---

## 🎯 Test Scenario 4: Session Persistence

This tests that your progress is saved if you refresh the page.

### Test Steps:
1. Start a new review session
2. Complete 2-3 reviews
3. **Refresh the page** (F5 or Cmd+R)
4. You should return to where you left off
5. Your previous selections should still be there if you go back

---

## 🔍 Advanced Testing

### Test API Directly

**Check server health:**
```bash
curl http://localhost:3001/health
```

**Create a test session:**
```bash
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test",
    "created_by": "API User",
    "businesses": [{
      "name": "Test Business",
      "description": "Test description",
      "industry": "Tech",
      "content_style": "Modern",
      "writing_style": "Casual",
      "image_url_a": "https://via.placeholder.com/800x2400/3B82F6/ffffff?text=A",
      "image_url_b": "https://via.placeholder.com/800x2400/10B981/ffffff?text=B"
    }]
  }'
```

**Get session data** (replace SESSION_ID):
```bash
curl http://localhost:3001/api/sessions/SESSION_ID
```

**View analytics** (replace SESSION_ID):
```bash
curl http://localhost:3001/api/analytics/SESSION_ID
```

---

## 🐛 Troubleshooting

### Frontend not loading?
```bash
# Check if it's running
curl http://localhost:3000

# If not, restart it
cd /Users/pjhala/this-or-that/frontend
npm run dev
```

### Backend not responding?
```bash
# Check if it's running
curl http://localhost:3001/health

# If not, restart it
cd /Users/pjhala/this-or-that/backend
npm run dev
```

### Database issues?
```bash
# Check database file exists
ls -lh /Users/pjhala/this-or-that/backend/data/thisorthat.db

# Recreate database
cd /Users/pjhala/this-or-that/backend
npm run db:setup
```

### Check backend logs:
```bash
tail -f /tmp/backend.log
```

---

## ✅ What to Test / Verify

### Functionality Checklist:

- [ ] Upload page loads correctly
- [ ] Sample data creates a session successfully
- [ ] Review interface displays business info and images
- [ ] Images load correctly (or show error state)
- [ ] Clicking images selects them (border changes to black)
- [ ] Keyboard shortcuts work (A/B to select, arrows to navigate)
- [ ] Comments can be typed and saved
- [ ] "Previous" button works and restores previous state
- [ ] "Submit and Next" saves review and moves forward
- [ ] Progress counter shows correct position (e.g., "3 of 10")
- [ ] Analytics page loads and shows correct data
- [ ] Overall preference chart shows correct percentages
- [ ] Per-business table shows all businesses
- [ ] Comments are grouped by option (A vs B)
- [ ] CSV export downloads successfully
- [ ] Multiple reviewers can review same session
- [ ] Page refresh preserves progress
- [ ] CSV/Excel upload works with custom data

### Performance Checklist:

- [ ] Images load within 3 seconds
- [ ] Page transitions are smooth
- [ ] No console errors in browser dev tools
- [ ] Analytics page loads quickly (even with 50+ businesses)
- [ ] CSV export completes within 2 seconds

---

## 📊 Sample Data Files

The project includes a sample CSV file at:
```
/Users/pjhala/this-or-that/sample-data.csv
```

This has 10 example businesses with placeholder images.

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ You can create a session with sample data
2. ✅ Images load side-by-side
3. ✅ You can select options and add comments
4. ✅ Analytics page shows your preferences
5. ✅ Multiple reviewers can review independently
6. ✅ CSV export downloads with correct data

---

## 🚀 Next Steps After Testing

Once testing is successful:

1. **Upload your real data** with actual website screenshot URLs
2. **Share the review URL** with your team members
3. **Collect reviews** from multiple people
4. **Analyze results** on the analytics page
5. **Export to CSV** for deeper analysis

---

## 📝 Notes

- The database is stored at: `/Users/pjhala/this-or-that/backend/data/thisorthat.db`
- All data persists between sessions
- You can create multiple test sessions
- Each reviewer's data is tracked separately

---

## 🛑 Stop the Servers

When you're done testing:

```bash
# Stop backend
pkill -f "tsx watch src/server.ts"

# Stop frontend
# Press Ctrl+C in the terminal where it's running
# Or: pkill -f "vite"
```

---

**Ready to test? Open http://localhost:3000 and start reviewing!** 🎨

