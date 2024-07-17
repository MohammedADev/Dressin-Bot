import { chromium, Browser, Page } from "playwright";
import { config } from "./config";
import { takeScreenshot } from "./utils/screenshot";
import { waitForSelectorAndClick } from "./utils/page-actions";
import { fillRegistrationForm, verifyEmail } from "./modules/registration";
import { selectProductOptions, addToCart } from "./modules/product-selection";
import { fillCheckoutForm, completeCheckout } from "./modules/checkout";
import { closeModalIfPresent } from "./modules/modal-handler";
import { infiniteScrape } from "./utils/retry";
import { retry } from "./utils/retry";

async function scrape(): Promise<void> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage({ viewport: { height: 1080, width: 1920 } });

    await page.goto(config.INITIAL_URL);

    // Registration process
    await retry(() =>
      waitForSelectorAndClick(
        page!,
        "div.back-page-btn.to-share-and-win",
        60000
      )
    );
    await page!.waitForTimeout(5000);
    await page!.waitForSelector("div.login_register_container.register", {
      state: "visible",
      timeout: 60000,
    });
    await retry(() => fillRegistrationForm(page!));
    await takeScreenshot(page!, "filled_form.png");
    await retry(() =>
      page!.click("xpath=/html/body/div[1]/div/div[2]/div[2]/div[2]/div[5]/div")
    );
    await page.waitForTimeout(7000);
    await page!.waitForLoadState("networkidle");
    await takeScreenshot(page!, "after_redirect.png");

    // Email verification
    await page!.goto("https://www.dressin.com/customer/my-profile");
    await page!.waitForLoadState("networkidle");
    await retry(() => verifyEmail(page!));
    await takeScreenshot(page!, "after_manual_email_verification.png");

    // Product selection and checkout
    await page!.goto(config.PRODUCT_URL, { timeout: 60000 });
    await page!.waitForTimeout(3000);
    await retry(() => closeModalIfPresent(page!));
    await page!.waitForLoadState("networkidle");
    await retry(() => selectProductOptions(page!));
    await retry(() => addToCart(page!));
    await page!.waitForTimeout(4000);
    await page!.goto("https://www.dressin.com/checkout/cart");
    await page!.waitForTimeout(7000);
    await page!.waitForLoadState("networkidle");

    await retry(() =>
      waitForSelectorAndClick(
        page!,
        "xpath=/html/body/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[3]/div/button",
        60000
      )
    );
    await page!.waitForTimeout(1000);
    await page!.waitForLoadState("networkidle");

    await retry(() => fillCheckoutForm(page!));
    await retry(() =>
      waitForSelectorAndClick(
        page!,
        "xpath=/html/body/div[1]/div[2]/div[2]/div/div[2]/div/div[3]/div/form/div[4]/span"
      )
    );
    await page!.waitForLoadState("networkidle");

    await retry(() => closeModalIfPresent(page!));
    await retry(() => completeCheckout(page!));

    await takeScreenshot(page!, "order_confirmation.png");
  } catch (error) {
    console.error("An error occurred:", error);
    if (page) {
      await takeScreenshot(page, "error_state.png");
    }
    throw error; // Rethrow the error so the retry mechanism can catch it
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed.");
    }
  }
}

// Main execution
infiniteScrape(scrape, 3, 10000, 60000).catch((error) => {
  console.error("Unhandled error in infiniteScrape:", error);
  process.exit(1);
});
