import { Page } from "playwright";
import { waitForSelectorAndClick } from "../utils/page-actions";

export async function selectProductOptions(page: Page): Promise<void> {
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div[1]/div[3]/div/div[1]/div[2]/ul/li[1]/div"
  );
  console.log("Selected first option");
  await page.waitForTimeout(1000);
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div[1]/div[3]/div/div[2]/div[2]/ul/div/div/input"
  );
  console.log("Clicked second option");
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div[1]/div[3]/div/div[2]/div[2]/ul/div/ul/li[3]"
  );
  console.log("Selected second option");
}

export async function addToCart(page: Page): Promise<void> {
  await waitForSelectorAndClick(
    page,
    "xpath=/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div[1]/div[6]/div[1]/div/div/button"
  );
  console.log("Clicked Add to Cart button");
  await page.waitForLoadState("networkidle");
  console.log("Waiting for redirection");
  await page.waitForTimeout(2000);
}
