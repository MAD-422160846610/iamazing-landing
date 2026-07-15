const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:8080');

  // Capture intro mid-animation
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'C:\\Users\\Venier\\.gemini\\antigravity\\brain\\a48b7cb0-c3b3-4698-a00a-54ef0f2fda61\\intro_verified.png' });
  console.log('Intro screenshot saved');

  // Wait for intro to finish then capture landing with mouse in center
  await page.waitForTimeout(3500);
  await page.mouse.move(640, 360);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:\\Users\\Venier\\.gemini\\antigravity\\brain\\a48b7cb0-c3b3-4698-a00a-54ef0f2fda61\\landing_verified.png' });
  console.log('Landing screenshot saved');

  await browser.close();
})();
