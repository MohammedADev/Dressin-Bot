import { chromium, Browser, Page } from "playwright";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { getEnvVariable } from "./utils";
import * as readline from "readline";
import { RandomEmail } from "./algo";

const SCREENSHOTS_DIR = join(__dirname, "screenshots");

async function getUserInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function takeScreenshot(page: Page, fileName: string): Promise<void> {
  const screenshotPath = join(SCREENSHOTS_DIR, fileName);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to ${screenshotPath}`);
}

async function waitForSelectorAndClick(
  page: Page,
  selector: string,
  timeout: number = 30000
): Promise<void> {
  await page.waitForSelector(selector, { state: "visible", timeout });
  await page.click(selector);
}

async function typeWithDelay(
  page: Page,
  selector: string,
  text: string,
  delay: number = 100
): Promise<void> {
  await page.focus(selector);
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(delay);
  }
}

async function fillForm(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await typeWithDelay(page, "#register_email_input", email);
  console.log("Filled email input");

  await typeWithDelay(
    page,
    "xpath=/html/body/div[1]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div[1]/input",
    password
  );
  console.log("Filled new password field");

  await typeWithDelay(
    page,
    "xpath=/html/body/div[1]/div/div[2]/div[2]/div[2]/div[3]/div[2]/div[1]/input",
    password
  );
  console.log("Filled confirm password field");
}

async function verifyEmail(page: Page): Promise<void> {
  await waitForSelectorAndClick(page, 'xpath=//*[@id="verifyEmail"]', 60000);
  console.log("Clicked email verification button");
  await getUserInput(
    "Please verify your email manually. Press Enter when done..."
  );
  console.log("Continuing after manual email verification");
}

async function selectProductOptions(page: Page): Promise<void> {
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div[1]/div[3]/div/div[1]/div[2]/ul/li[1]/div"
  );
  console.log("Selected first option");
  await page.waitForTimeout(1000); // Add a delay between selections
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div[1]/div[3]/div/div[2]/div[2]/ul/div/ul/li[3]"
  );
  console.log("Selected second option");
}

async function addToCart(page: Page): Promise<void> {
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div[1]/div[6]/div[1]/div/div/button"
  );
  console.log("Clicked Add to Cart button");
  await page.waitForLoadState("networkidle");
  console.log("Waiting for redirection");
  await page.waitForTimeout(5000);
}

async function scrape(): Promise<void> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage({ viewport: { height: 1080, width: 1920 } });

    if (!existsSync(SCREENSHOTS_DIR)) {
      mkdirSync(SCREENSHOTS_DIR);
    }

    const initialUrl =
      "https://www.dressin.com/sharedpage?aicode=vtfG1yUM&app_name=app&share=copy_url";
    await page.goto(initialUrl);

    await waitForSelectorAndClick(
      page,
      "div.back-page-btn.to-share-and-win",
      60000
    );
    await page.waitForTimeout(5000);

    await page.waitForSelector("div.login_register_container.register", {
      state: "visible",
      timeout: 60000,
    });
    console.log("Registration form is visible");

    await fillForm(page, RandomEmail(), getEnvVariable("PASSWORD"));
    await takeScreenshot(page, "filled_form.png");

    // continue button
    await page.click(
      "xpath=/html/body/div[1]/div/div[2]/div[2]/div[2]/div[5]/div"
    ),
      await page.waitForLoadState("networkidle");

    await takeScreenshot(page, "after_redirect.png");
    await page.waitForTimeout(7000); // Add a delay between selections
    await page.goto("https://www.dressin.com/customer/my-profile");
    await page.waitForLoadState("networkidle");
    console.log("Profile page loaded");

    await verifyEmail(page);
    await takeScreenshot(page, "after_manual_email_verification.png");

    await page.goto(
      "https://www.dressin.com/products/solid-round-neck-knit-t-shirt-p25180",
      { timeout: 60000 }
    );
    await page.waitForLoadState("networkidle");
    console.log("Product page loaded");

    await selectProductOptions(page);
    await addToCart(page);
    await takeScreenshot(page, "after_product_selection.png");
  } catch (error) {
    console.error("An error occurred:", error);
    if (page) {
      await takeScreenshot(page, "error_state.png");
    }
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed.");
    }
  }
}

scrape().catch((error) => {
  console.error("Unhandled error in main script execution:", error);
  process.exit(1);
});
