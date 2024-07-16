import { chromium, Browser, Page } from "playwright";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

async function scrape() {
  const browser: Browser = await chromium.launch();
  const page: Page = await browser.newPage();
  await page.goto("https://example.com");

  // Ensure the screenshots directory exists
  const screenshotsDir = join(__dirname, "screenshots");
  if (!existsSync(screenshotsDir)) {
    mkdirSync(screenshotsDir);
  }

  // Example: Extract the title of the page
  const title = await page.title();
  console.log(`Title: ${title}`);

  // Example: Extract text from a specific element
  const elementText = await page.$eval("h1", (element) => element.textContent);
  console.log(`Element text: ${elementText}`);

  // Example: Take a screenshot
  const screenshotPath = join(screenshotsDir, "example.png");
  await page.screenshot({ path: screenshotPath });

  await browser.close();
}

scrape();
