import { Page } from "playwright";
import { ModalHandler } from "../types";

export const closeModalIfPresent: ModalHandler = async (
  page: Page
): Promise<void> => {
  const MODAL_CLOSE_XPATHS = [
    "xpath=/html/body/div[1]/div[7]/div/div/div[1]/div",
    "xpath=/html/body/div[1]/div[4]/div[1]/form/div[4]/div[3]/div[3]/div/div[4]/div[1]",
  ];
  for (const xpath of MODAL_CLOSE_XPATHS) {
    try {
      const modalCloseButton = await page.$(xpath);
      if (modalCloseButton) {
        console.log("Modal detected. Attempting to close...");
        await modalCloseButton.click();
        await page.waitForTimeout(1000);
        console.log("Modal closed successfully.");
        return;
      }
    } catch (error) {
      console.warn(
        `Error while trying to close modal using xpath ${xpath}:`,
        error
      );
    }
  }
};
