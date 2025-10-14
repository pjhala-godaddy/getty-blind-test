# Getty Blind Test - GitHub Pages Deployment

## ✅ Deployment Complete!

Your app has been deployed to GitHub Pages!

---

## 📍 Final Setup Step

Enable GitHub Pages in your repository:

1. **Go to**: https://github.com/pjhala-godaddy/getty-blind-test/settings/pages

2. **Source**: Select "Deploy from a branch"

3. **Branch**: Select `gh-pages` → `/ (root)`

4. **Save**

5. **Wait 1-2 minutes** for GitHub to build and deploy

---

## 🌐 Your App URL

Once enabled, your app will be live at:

```
https://pjhala-godaddy.github.io/getty-blind-test/
```

---

## 🎯 How It Works

### Client-Side Only Architecture

✅ **No backend needed** - Everything runs in the browser  
✅ **No database** - All data saved in localStorage  
✅ **No hosting costs** - GitHub Pages is free  
✅ **Instant deployment** - Just run `npm run deploy`

### Features

- **59 Real Businesses** - From your GoDaddy WSBA test dataset
- **A/B Image Comparison** - Side-by-side website mockup review
- **Comments & Ratings** - Add notes for each option
- **Analytics Dashboard** - View preferences and comment themes
- **Keyboard Shortcuts** - A/B to select, arrows to navigate
- **Export to CSV** - Download all results for analysis

---

## 👥 Multi-Reviewer Support

### Option 1: Everyone Uses Same Browser Session

- Share the link with your team
- Everyone uses the same laptop/computer
- Each person enters their name
- All reviews stored in that browser

### Option 2: Individual Review Sessions

- Each person opens the app in their own browser
- Enters their name
- Reviews independently
- Export their results to CSV
- Combine CSVs manually in Excel

---

## 🔄 How to Update the App

### Update Business Data

1. Edit `/Users/pjhala/getty-blind-test/real-data.csv`
2. Regenerate JSON:
```bash
cd /Users/pjhala/getty-blind-test
node -e "
const fs = require('fs');
const csv = fs.readFileSync('real-data.csv', 'utf8');
const lines = csv.split('\n').slice(1).filter(l => l.trim() && !l.startsWith(','));
const data = lines.map(line => {
  const parts = line.split(',');
  return {
    name: parts[0].trim(),
    description: parts[1].trim(),
    industry: parts[2].trim(),
    content_style: parts[3].trim(),
    writing_style: parts[4].trim(),
    image_url_a: parts[5].trim(),
    image_url_b: parts[6].trim()
  };
});
fs.writeFileSync('frontend/src/data/businesses.json', JSON.stringify(data, null, 2));
"
```
3. Deploy:
```bash
cd frontend
npm run deploy
```

### Update UI or Code

1. Make changes to files in `frontend/src/`
2. Test locally:
```bash
cd frontend
npm run dev
```
3. Deploy:
```bash
npm run deploy
```

---

## 📊 Export Results

Click **"Export Results (CSV)"** on the Analytics page to download:
- All business results
- Reviewer votes (A vs B)
- All comments
- Timestamps

---

## 🐛 Troubleshooting

### App not loading?
- Check GitHub Pages is enabled (step above)
- Wait 2-3 minutes after enabling
- Clear browser cache and refresh

### Lost data?
- Data is stored in browser localStorage
- Don't clear browser data
- Export to CSV regularly for backup

### Images not loading?
- Check image URLs in CSV file
- Ensure URLs are accessible publicly
- Try opening image URL directly in browser

---

## 📁 Project Structure

```
getty-blind-test/
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Main pages
│   │   ├── utils/           # Client storage logic
│   │   ├── data/            # Business data JSON
│   │   └── styles/          # CSS files
│   └── package.json
├── real-data.csv            # Source data (59 businesses)
└── README.md
```

---

## 🎉 You're All Set!

Your Getty Blind Test is live and ready for use!

**Next Steps:**
1. Enable GitHub Pages (link above)
2. Wait 2 minutes
3. Visit your app URL
4. Share with your team
5. Start reviewing!

---

## 💡 Tips for Best Results

1. **Use a Large Monitor** - Better for side-by-side comparison
2. **Use Keyboard Shortcuts** - Faster navigation (A, B, arrows)
3. **Export Regularly** - Backup your data as CSV
4. **Add Detailed Comments** - Helps identify patterns
5. **Review in Batches** - Take breaks every 15-20 businesses

---

**Questions?** Check the main README.md or TESTING_GUIDE.md

