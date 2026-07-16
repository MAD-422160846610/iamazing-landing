const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser to view the Mobile-First version...');
  
  // Launch non-headless browser
  const browser = await chromium.launch({
    headless: false
  });
  
  // Create context with standard viewport (can be resized by user)
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  await page.goto('http://localhost:8080/mobile_first_dev/index.html');
  
  console.log('Browser is running. Resize the window to test mobile-first responsiveness!');
  console.log('Close the browser window to finish.');
  
  // Wait until browser or page is closed
  await new Promise((resolve) => {
    page.on('close', resolve);
    browser.on('disconnected', resolve);
  });
  
  console.log('Browser closed. Exiting...');
  process.exit(0);
})();
