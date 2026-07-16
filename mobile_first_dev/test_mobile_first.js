const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Test Mobile Viewport
  console.log('Testing mobile layout...');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:8080/mobile_first_dev/index.html');
  
  // Wait for the intro animation to finish and hide
  await page.waitForSelector('#iamazing-intro-container', { state: 'hidden', timeout: 15000 });
  await page.screenshot({ path: 'C:\\Users\\Venier\\.gemini\\antigravity\\brain\\a48b7cb0-c3b3-4698-a00a-54ef0f2fda61\\mobile_first_mobile.png' });
  console.log('Mobile screenshot saved.');

  // Test Desktop Viewport
  console.log('Testing desktop layout...');
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:8080/mobile_first_dev/index.html');
  
  // Wait for the intro animation to finish and hide
  await page.waitForSelector('#iamazing-intro-container', { state: 'hidden', timeout: 15000 });
  await page.mouse.move(640, 360);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Users\\Venier\\.gemini\\antigravity\\brain\\a48b7cb0-c3b3-4698-a00a-54ef0f2fda61\\mobile_first_desktop.png' });
  console.log('Desktop screenshot saved.');

  await browser.close();
})();
