import { Page } from "playwright";
import { PageAction } from "../types";

export const waitForSelectorAndClick: PageAction = async (
  page: Page,
  selector: string,
  timeout: number = 30000
): Promise<void> => {
  await page.waitForSelector(selector, { state: "visible", timeout });
  await page.click(selector);
};

export const typeWithDelay: PageAction = async (
  page: Page,
  selector: string,
  text: string,
  delay: number = 100
): Promise<void> => {
  await page.focus(selector);
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(delay);
  }
};
