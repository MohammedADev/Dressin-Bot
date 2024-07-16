import { Page } from "playwright";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { SCREENSHOTS_DIR } from "../config";

export async function takeScreenshot(
  page: Page,
  fileName: string
): Promise<void> {
  if (!existsSync(SCREENSHOTS_DIR)) {
    mkdirSync(SCREENSHOTS_DIR);
  }
  const screenshotPath = join(SCREENSHOTS_DIR, fileName);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to ${screenshotPath}`);
}
