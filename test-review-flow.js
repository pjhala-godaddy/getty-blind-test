#!/usr/bin/env node

/**
 * Getty Blind Test - Automated Review Flow Test
 * Tests 3 submit and next button clicks
 */

const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:3000';
const REVIEWER_NAME = 'Test User';

async function runTests() {
  console.log('🧪 Starting Getty Blind Test - Review Flow Tests\n');
  
  let browser;
  let testsPassed = 0;
  let testsFailed = 0;
  const issues = [];

  try {
    browser = await puppeteer.launch({ 
      headless: false,
      slowMo: 500 // Slow down to see what's happening
    });
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Collect console logs
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push(`${msg.type()}: ${msg.text()}`);
      console.log(`   [Browser Console] ${msg.text()}`);
    });
    
    // Collect network errors
    page.on('requestfailed', request => {
      console.log(`   ❌ [Network Error] ${request.url()}`);
      issues.push(`Network request failed: ${request.url()}`);
    });

    console.log('📍 TEST 1: Initial Page Load');
    console.log('─'.repeat(60));
    
    await page.goto(TEST_URL, { waitUntil: 'networkidle0' });
    
    // Check if page loaded
    const title = await page.title();
    console.log(`   Page title: ${title}`);
    if (title.includes('Getty Blind Test')) {
      console.log('   ✅ Page loaded successfully');
      testsPassed++;
    } else {
      console.log('   ❌ Page title incorrect');
      testsFailed++;
      issues.push('Page title incorrect');
    }
    
    // Check for heading
    const heading = await page.$eval('h1', el => el.textContent);
    console.log(`   Heading: ${heading}`);
    if (heading.includes('Getty Blind Test')) {
      console.log('   ✅ Heading displayed correctly');
      testsPassed++;
    } else {
      console.log('   ❌ Heading not found');
      testsFailed++;
    }
    
    // Check business count
    const infoText = await page.$eval('.info-card', el => el.textContent);
    if (infoText.includes('59 businesses') || infoText.includes('businesses')) {
      console.log('   ✅ Business count displayed');
      testsPassed++;
    } else {
      console.log('   ❌ Business count not found');
      testsFailed++;
    }

    console.log('\n📍 TEST 2: Start Review Session');
    console.log('─'.repeat(60));
    
    // Enter reviewer name
    await page.type('input[type="text"]', REVIEWER_NAME);
    console.log(`   Entered name: ${REVIEWER_NAME}`);
    
    // Click Start Reviewing
    await page.click('button.start-btn');
    console.log('   Clicked "Start Reviewing"');
    
    // Wait for navigation and images to load
    await page.waitForSelector('.image-viewer, .image-wrapper', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if on review page
    const currentUrl = page.url();
    if (currentUrl.includes('/review/')) {
      console.log('   ✅ Navigated to review page');
      testsPassed++;
    } else {
      console.log('   ❌ Failed to navigate to review page');
      testsFailed++;
      issues.push('Navigation to review page failed');
    }
    
    // Check for business card
    const businessCard = await page.$('.business-card');
    if (businessCard) {
      const businessName = await page.$eval('.business-card', el => el.textContent);
      console.log(`   ✅ Business card displayed: ${businessName.substring(0, 50)}...`);
      testsPassed++;
    } else {
      console.log('   ❌ Business card not found');
      testsFailed++;
      issues.push('Business card not displayed');
    }
    
    // Check for images
    const images = await page.$$('img.image, .image-wrapper img');
    console.log(`   Found ${images.length} images`);
    if (images.length >= 2) {
      console.log('   ✅ Both images displayed');
      testsPassed++;
    } else {
      console.log('   ❌ Images not displaying correctly');
      testsFailed++;
      issues.push(`Only ${images.length} images found, expected 2`);
    }

    console.log('\n📍 TEST 3: First Review - Select Option A');
    console.log('─'.repeat(60));
    
    // Click on first image (Option A)
    await page.click('.image-option:first-child .image-wrapper');
    console.log('   Clicked Option A');
    await new Promise(r => setTimeout(r, 500));
    
    // Check if selected
    const selectedA = await page.$('.image-option:first-child .image-wrapper.selected');
    if (selectedA) {
      console.log('   ✅ Option A selected (border highlighted)');
      testsPassed++;
    } else {
      console.log('   ❌ Option A not selected');
      testsFailed++;
      issues.push('Option A selection failed');
    }
    
    // Add comment
    const commentBoxes = await page.$$('textarea');
    if (commentBoxes.length >= 1) {
      await commentBoxes[0].type('Clean design, good layout');
      console.log('   ✅ Comment added to Option A');
      testsPassed++;
    }
    
    // Click Submit and Next
    await page.click('button.btn-primary');
    console.log('   Clicked "Submit and Next"');
    await new Promise(r => setTimeout(r, 1500));
    
    // Check if moved to business 2
    const counter = await page.$eval('.counter', el => el.textContent);
    if (counter.includes('2')) {
      console.log(`   ✅ Moved to next business (${counter})`);
      testsPassed++;
    } else {
      console.log('   ❌ Did not advance to next business');
      testsFailed++;
      issues.push('Failed to advance after first review');
    }

    console.log('\n📍 TEST 4: Second Review - Select Option B');
    console.log('─'.repeat(60));
    
    // Click on second image (Option B)
    await page.click('.image-option:nth-child(2) .image-wrapper');
    console.log('   Clicked Option B');
    await new Promise(r => setTimeout(r, 500));
    
    // Check if selected
    const selectedB = await page.$('.image-option:nth-child(2) .image-wrapper.selected');
    if (selectedB) {
      console.log('   ✅ Option B selected');
      testsPassed++;
    } else {
      console.log('   ❌ Option B not selected');
      testsFailed++;
      issues.push('Option B selection failed');
    }
    
    // Add comment to Option B
    const commentBoxes2 = await page.$$('textarea');
    if (commentBoxes2.length >= 2) {
      await commentBoxes2[1].type('Better color scheme');
      console.log('   ✅ Comment added to Option B');
      testsPassed++;
    }
    
    // Click Submit and Next
    await page.click('button.btn-primary');
    console.log('   Clicked "Submit and Next"');
    await new Promise(r => setTimeout(r, 1500));
    
    // Check if moved to business 3
    const counter2 = await page.$eval('.counter', el => el.textContent);
    if (counter2.includes('3')) {
      console.log(`   ✅ Moved to business 3 (${counter2})`);
      testsPassed++;
    } else {
      console.log('   ❌ Did not advance to business 3');
      testsFailed++;
      issues.push('Failed to advance after second review');
    }

    console.log('\n📍 TEST 5: Third Review - Test Keyboard Shortcut');
    console.log('─'.repeat(60));
    
    // Press 'A' key
    await page.keyboard.press('a');
    console.log('   Pressed "A" key');
    await new Promise(r => setTimeout(r, 500));
    
    // Check if Option A selected
    const selectedA2 = await page.$('.image-option:first-child .image-wrapper.selected');
    if (selectedA2) {
      console.log('   ✅ Keyboard shortcut worked (Option A selected)');
      testsPassed++;
    } else {
      console.log('   ❌ Keyboard shortcut did not work');
      testsFailed++;
      issues.push('Keyboard shortcut "A" failed');
    }
    
    // Submit
    await page.click('button.btn-primary');
    console.log('   Clicked "Submit and Next"');
    await new Promise(r => setTimeout(r, 1500));
    
    const counter3 = await page.$eval('.counter', el => el.textContent);
    if (counter3.includes('4')) {
      console.log(`   ✅ Moved to business 4 (${counter3})`);
      testsPassed++;
    } else {
      console.log('   ❌ Did not advance to business 4');
      testsFailed++;
    }

    console.log('\n📍 TEST 6: Data Persistence Check');
    console.log('─'.repeat(60));
    
    // Check localStorage
    const localStorageData = await page.evaluate(() => {
      const data = localStorage.getItem('getty_blind_test_data');
      return data ? JSON.parse(data) : null;
    });
    
    if (localStorageData) {
      console.log(`   ✅ localStorage data exists`);
      console.log(`   Session name: ${localStorageData.session.name}`);
      console.log(`   Businesses loaded: ${localStorageData.businesses.length}`);
      console.log(`   Reviews submitted: ${localStorageData.reviews.length}`);
      testsPassed++;
      
      if (localStorageData.reviews.length === 3) {
        console.log('   ✅ All 3 reviews saved correctly');
        testsPassed++;
        
        // Check review details
        localStorageData.reviews.forEach((review, idx) => {
          console.log(`   Review ${idx + 1}: Option ${review.selected_option}, ` +
                     `Comment A: "${review.comment_a || 'none'}", ` +
                     `Comment B: "${review.comment_b || 'none'}"`);
        });
      } else {
        console.log(`   ❌ Expected 3 reviews, found ${localStorageData.reviews.length}`);
        testsFailed++;
        issues.push(`Review count mismatch: ${localStorageData.reviews.length} instead of 3`);
      }
      
      // Check image URLs
      const firstBusiness = localStorageData.businesses[0];
      if (firstBusiness.image_url_a && firstBusiness.image_url_b) {
        console.log(`   ✅ Image URLs present in data`);
        console.log(`   First business: ${firstBusiness.name}`);
        console.log(`   Image A: ${firstBusiness.image_url_a.substring(0, 60)}...`);
        testsPassed++;
      } else {
        console.log(`   ❌ Image URLs missing from data`);
        testsFailed++;
        issues.push('Image URLs not saved correctly');
      }
    } else {
      console.log('   ❌ localStorage data not found');
      testsFailed++;
      issues.push('localStorage data missing');
    }

    console.log('\n📍 TEST 7: Previous Button Navigation');
    console.log('─'.repeat(60));
    
    // Click Previous button
    await page.click('button.btn-secondary');
    console.log('   Clicked "Previous" button');
    await new Promise(r => setTimeout(r, 1000));
    
    const counter4 = await page.$eval('.counter', el => el.textContent);
    if (counter4.includes('3')) {
      console.log(`   ✅ Navigated back to business 3 (${counter4})`);
      testsPassed++;
    } else {
      console.log('   ❌ Previous button did not work');
      testsFailed++;
      issues.push('Previous button navigation failed');
    }

    console.log('\n📍 TEST 8: Image Network Requests');
    console.log('─'.repeat(60));
    
    // Check network requests in logs
    const imageRequests = consoleLogs.filter(log => 
      log.includes('ImageViewer') && log.includes('URL:')
    );
    
    console.log(`   Found ${imageRequests.length} ImageViewer render logs`);
    if (imageRequests.length >= 6) { // At least 6 (3 businesses x 2 images)
      console.log('   ✅ Images being rendered');
      testsPassed++;
    } else {
      console.log('   ❌ Not enough image render calls');
      testsFailed++;
      issues.push(`Only ${imageRequests.length} image renders, expected at least 6`);
    }
    
    // Take screenshot
    await page.screenshot({ path: '/Users/pjhala/getty-blind-test/test-screenshot.png', fullPage: true });
    console.log('   📸 Screenshot saved: test-screenshot.png');

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    testsFailed++;
    issues.push(`Fatal error: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  
  if (issues.length > 0) {
    console.log('\n🐛 ISSUES FOUND:');
    issues.forEach((issue, idx) => {
      console.log(`   ${idx + 1}. ${issue}`);
    });
  } else {
    console.log('\n🎉 ALL TESTS PASSED! No issues found.');
  }
  
  console.log('\n');
  process.exit(testsFailed > 0 ? 1 : 0);
}

runTests();

