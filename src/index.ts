import { chromium, Browser, Page } from "playwright";
import { takeScreenshot } from "./utils/screenshot";
import { waitForSelectorAndClick } from "./utils/page-actions";
import { fillRegistrationForm, verifyEmail } from "./modules/registration";
import { selectProductOptions, addToCart } from "./modules/product-selection";
import { fillCheckoutForm, completeCheckout } from "./modules/checkout";
import { closeModalIfPresent } from "./modules/modal-handler";
import { config } from "./config";

async function scrape(): Promise<void> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage({ viewport: { height: 1080, width: 1920 } });

    await page.goto(config.INITIAL_URL);

    // Registration process
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
    await fillRegistrationForm(page);
    await takeScreenshot(page, "filled_form.png");
    await page.click(
      "xpath=/html/body/div[1]/div/div[2]/div[2]/div[2]/div[5]/div"
    );
    await page.waitForLoadState("networkidle");
    await takeScreenshot(page, "after_redirect.png");

    // Email verification
    await page.goto("https://www.dressin.com/customer/my-profile");
    await page.waitForLoadState("networkidle");
    await verifyEmail(page);
    await takeScreenshot(page, "after_manual_email_verification.png");

    // Product selection and checkout
    await page.goto(config.PRODUCT_URL, { timeout: 60000 });
    await page.waitForTimeout(3000);
    await closeModalIfPresent(page);
    await page.waitForLoadState("networkidle");
    await selectProductOptions(page);
    await addToCart(page);
    await page.waitForTimeout(4000);
    await page.goto("https://www.dressin.com/checkout/cart");
    await page.waitForTimeout(7000);
    await page.waitForLoadState("networkidle");

    await waitForSelectorAndClick(
      page,
      "xpath=/html/body/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[3]/div/button",
      60000
    );
    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");

    await fillCheckoutForm(page);
    await waitForSelectorAndClick(
      page,
      "xpath=/html/body/div[1]/div[2]/div[2]/div/div[2]/div/div[3]/div/form/div[4]/span"
    );
    await page.waitForLoadState("networkidle");

    await closeModalIfPresent(page);
    await completeCheckout(page);

    await takeScreenshot(page, "order_confirmation.png");
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
