import { Page } from "playwright";
import { typeWithDelay, waitForSelectorAndClick } from "../utils/page-actions";
import { CheckoutFormData, CheckoutStep } from "../types";
import { getEnvVariable } from "../utils/getEnv";

export const fillCheckoutForm: CheckoutStep = async (
  page: Page
): Promise<void> => {
  const formData: CheckoutFormData = {
    firstName: getEnvVariable("FIRST_NAME"),
    lastName: getEnvVariable("LAST_NAME"),
    address: getEnvVariable("ADDRESS"),
    phone: getEnvVariable("PHONE"),
  };

  await typeWithDelay(
    page,
    "xpath=/html/body/div[1]/div[2]/div[2]/div/div[2]/div/div[3]/div/form/div[1]/div[1]/input",
    formData.firstName
  );
  await typeWithDelay(
    page,
    "xpath=/html/body/div[1]/div[2]/div[2]/div/div[2]/div/div[3]/div/form/div[1]/div[2]/input",
    formData.lastName
  );
  await typeWithDelay(page, '//*[@id="addressAutocomplete"]', formData.address);
  await page.waitForTimeout(1000);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);
  await typeWithDelay(
    page,
    "xpath=/html/body/div[1]/div[2]/div[2]/div/div[2]/div/div[3]/div/form/div[1]/div[9]/input",
    formData.phone
  );
};

export async function completeCheckout(page: Page): Promise<void> {
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[4]/div[1]/form/div[1]/ul/li[1]"
  );
  await page.waitForLoadState("networkidle");

  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[4]/div[1]/form/div[3]/div[2]/div[1]/div[3]/span"
  );
  await page.waitForLoadState("networkidle");

  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[4]/div[1]/form/div[4]/ul/li[1]"
  );
  await page.waitForLoadState("networkidle");

  await waitForSelectorAndClick(
    page,
    'xpath=//*[@id="onestepcheckout-place-order"]'
  );
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);

  console.log("Order placed successfully");
}
