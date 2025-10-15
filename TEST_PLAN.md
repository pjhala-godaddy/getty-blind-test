# Getty Blind Test - Test Plan

## Test Objective
Verify that users can successfully review multiple businesses, submit selections, and navigate through at least 3 business comparisons.

## Test Environment
- **Local**: http://localhost:3000
- **Production**: https://pjhala-godaddy.github.io/getty-blind-test/

---

## Test Cases

### TC1: Initial Load and Session Creation

**Steps:**
1. Navigate to app URL
2. Verify page loads with "Getty Blind Test" heading
3. Check that "59 businesses" is displayed
4. Enter reviewer name: "Test User"
5. Click "Start Reviewing"

**Expected Results:**
- ✅ Home page loads successfully
- ✅ Business count displays correctly
- ✅ Name input accepts text
- ✅ Navigation to review page occurs
- ✅ First business displays with 2 images side-by-side

**Console Logs to Verify:**
```
REAL_DATA loaded: 59 businesses
Starting review with data: 59 businesses
Session created: [session-id]
ReviewPage: Session loaded with 59 businesses
ImageViewer rendering: Option A URL: [url]
ImageViewer rendering: Option B URL: [url]
```

---

### TC2: First Business Review - Select Option A

**Steps:**
1. Review Business #1 images
2. Click on Option A image
3. Add comment in Option A text box: "Clean design, good layout"
4. Verify Option A is highlighted
5. Click "Submit and Next →" button

**Expected Results:**
- ✅ Option A image gets selected border
- ✅ Comment text is saved in state
- ✅ Submit button becomes enabled
- ✅ Business #2 loads
- ✅ Progress shows "2 of 59"
- ✅ Selection/comments from Business #1 are cleared
- ✅ Data saved to localStorage

**Console Logs to Verify:**
```
ReviewPage: Ready to display business 2
localStorage updated with review
```

---

### TC3: Second Business Review - Select Option B

**Steps:**
1. Review Business #2 images
2. Press keyboard shortcut "B"
3. Add comment in Option B text box: "Better color scheme"
4. Click "Submit and Next →" button

**Expected Results:**
- ✅ Option B selected via keyboard shortcut
- ✅ Comment saved
- ✅ Business #3 loads
- ✅ Progress shows "3 of 59"
- ✅ Previous selection cleared

**Console Logs to Verify:**
```
ReviewPage: Ready to display business 3
2 reviews saved in localStorage
```

---

### TC4: Third Business Review - Navigation Test

**Steps:**
1. Review Business #3 images
2. Click Option A
3. Click "Submit and Next →"
4. Verify Business #4 loads
5. Click "← Previous" button
6. Verify Business #3 reappears with blank selection

**Expected Results:**
- ✅ Business #4 loads after submit
- ✅ Progress shows "4 of 59"
- ✅ Previous button navigates back to Business #3
- ✅ Progress shows "3 of 59"
- ✅ Previous selection is NOT shown (fresh view)
- ✅ 3 reviews remain in localStorage

---

### TC5: Data Persistence Check

**Steps:**
1. Open Browser Console
2. Run: `JSON.parse(localStorage.getItem('getty_blind_test_data'))`
3. Verify structure

**Expected Results:**
```json
{
  "session": {
    "id": "[uuid]",
    "name": "WSBA Prompt Testing - 59 Businesses",
    "created_at": "[timestamp]",
    "created_by": "Test User"
  },
  "businesses": [
    {
      "id": "[uuid]",
      "name": "AI Partners",
      "image_url_a": "https://isteam.dev-wsimg.com/...",
      "image_url_b": "https://isteam.dev-wsimg.com/...",
      ...
    }
  ],
  "reviews": [
    {
      "id": "[uuid]",
      "business_id": "[uuid]",
      "reviewer_name": "Test User",
      "selected_option": "A",
      "comment_a": "Clean design, good layout",
      "comment_b": null,
      "time_spent_ms": [number]
    },
    {
      "id": "[uuid]",
      "selected_option": "B",
      "comment_b": "Better color scheme",
      ...
    },
    {
      "id": "[uuid]",
      "selected_option": "A",
      ...
    }
  ]
}
```

---

### TC6: Image Loading Verification

**Steps:**
1. Open Network tab in DevTools
2. Filter by "Img"
3. Review first 3 businesses
4. Check network requests

**Expected Results:**
- ✅ 6 image requests made (2 per business)
- ✅ All requests to `isteam.dev-wsimg.com`
- ✅ All return HTTP 200
- ✅ Images display correctly
- ✅ No CORS errors
- ✅ Loading states show while fetching

---

### TC7: Analytics Page Verification

**Steps:**
1. After reviewing 3 businesses
2. Click "View Analytics" button
3. Verify analytics display

**Expected Results:**
- ✅ Total Businesses: 59
- ✅ Total Reviews: 3
- ✅ Unique Reviewers: 1
- ✅ Overall preference chart shows counts
- ✅ Business results table shows 3 reviewed businesses
- ✅ Comments display in appropriate columns

---

## Known Issues to Check

### Issue 1: Images Not Loading for Other Users
- **Check**: Network tab shows image requests
- **Check**: Console logs show image URLs
- **Check**: No CORS errors
- **Fix**: Ensure proper URL structure in data

### Issue 2: Blank Screen
- **Check**: React Router basename correct
- **Check**: JavaScript bundle loads
- **Check**: Console errors present
- **Fix**: Verify base path configuration

### Issue 3: Data Not Persisting
- **Check**: localStorage writes successful
- **Check**: Data structure matches types
- **Fix**: Verify clientStorage.ts logic

---

## Automated Test Script

Run this in browser console after loading page:

```javascript
// Test localStorage
const testReview = () => {
  console.log('=== Testing Review Flow ===');
  
  // Check if data loaded
  const stored = localStorage.getItem('getty_blind_test_data');
  console.log('LocalStorage data exists:', !!stored);
  
  if (stored) {
    const data = JSON.parse(stored);
    console.log('Session:', data.session.name);
    console.log('Total businesses loaded:', data.businesses.length);
    console.log('Reviews submitted:', data.reviews.length);
    console.log('First business:', data.businesses[0].name);
    console.log('First business image A:', data.businesses[0].image_url_a);
    console.log('First business image B:', data.businesses[0].image_url_b);
    
    // Check reviews
    data.reviews.forEach((review, idx) => {
      console.log(`Review ${idx + 1}: Selected ${review.selected_option}, ` +
                  `Comment A: ${review.comment_a || 'none'}, ` +
                  `Comment B: ${review.comment_b || 'none'}`);
    });
    
    return data;
  }
  return null;
};

testReview();
```

---

## Success Criteria

✅ **All test cases pass**
✅ **No console errors**
✅ **Images load on all devices**
✅ **Data persists correctly**
✅ **Navigation works smoothly**
✅ **Analytics display accurately**

---

## Test Execution Log

### Run Date: [To be filled]
### Tester: [Name]
### Environment: [Local/Production]

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC1: Initial Load | ⬜ | |
| TC2: First Review | ⬜ | |
| TC3: Second Review | ⬜ | |
| TC4: Third Review | ⬜ | |
| TC5: Data Persistence | ⬜ | |
| TC6: Image Loading | ⬜ | |
| TC7: Analytics | ⬜ | |

---

## Issues Found

[Document any issues discovered during testing]

---

## Fixes Applied

[Document any fixes made]

