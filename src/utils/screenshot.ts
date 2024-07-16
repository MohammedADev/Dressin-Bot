import { Page } from "playwright";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { config } from "../config";

export async function takeScreenshot(
  page: Page,
  fileName: string
): Promise<void> {
  if (!existsSync(config.SCREENSHOTS_DIR)) {
    mkdirSync(config.SCREENSHOTS_DIR);
  }
  const screenshotPath = join(config.SCREENSHOTS_DIR, fileName);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to ${screenshotPath}`);
}
