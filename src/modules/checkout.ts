import { Page } from "playwright";
import { typeWithDelay, waitForSelectorAndClick } from "../utils/page-actions";
import { CheckoutFormData, CheckoutStep } from "../types";
import { getEnvVariable } from "../utils/getEnv";
import { RandomName } from "../utils/algo";

export const fillCheckoutForm: CheckoutStep = async (
  page: Page
): Promise<void> => {
  const formData: CheckoutFormData = {
    firstName: RandomName(),
    lastName: RandomName(),
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

export async function cancelOrder(page: Page): Promise<void> {
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[1]/div[1]/div[2]/div[2]/div/div/div[2]/div/div[3]/div/div[2]"
  );
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(4000);
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[1]/div[5]/div/div[2]/div[2]"
  );
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div/div/div[2]/div/div[3]/div/div[1]/input"
  );
  await page.waitForLoadState("networkidle");

  await waitForSelectorAndClick(page, 'xpath=//*[@id="next-step"]');
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div/div/div[3]/div/div[4]/form/div[1]/div[2]/input"
  );
  await waitForSelectorAndClick(page, 'xpath=//*[@id="reason_select"]');
  await page.waitForTimeout(1000);
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div/div/div[3]/div/div[4]/form/div[2]/div[1]/ul/li[2]"
  );
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div/div/div[3]/div/div[4]/div/div[2]"
  );
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);
  console.log("Order cancelled successfully");
}
