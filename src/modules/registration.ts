import { Page } from "playwright";
import { typeWithDelay, waitForSelectorAndClick } from "../utils/page-actions";
import { RandomEmail } from "../utils/algo";
import { RegistrationFormData, PageAction } from "../types";
import { getUserInput } from "../utils/input";
import { getEnvVariable } from "../utils/getEnv";

export const fillRegistrationForm: PageAction = async (
  page: Page
): Promise<void> => {
  const formData: RegistrationFormData = {
    email: RandomEmail(),
    password: getEnvVariable("PASSWORD"),
  };

  await typeWithDelay(page, "#register_email_input", formData.email);
  console.log("Filled email input");

  await typeWithDelay(
    page,
    "xpath=/html/body/div[1]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div[1]/input",
    formData.password
  );
  console.log("Filled new password field");

  await typeWithDelay(
    page,
    "xpath=/html/body/div[1]/div/div[2]/div[2]/div[2]/div[3]/div[2]/div[1]/input",
    formData.password
  );
  console.log("Filled confirm password field");
};

export async function verifyEmail(page: Page): Promise<void> {
  await waitForSelectorAndClick(page, 'xpath=//*[@id="verifyEmail"]', 60000);
  console.log("Clicked email verification button");
  await getUserInput(
    "Please verify your email manually. Press Enter when done..."
  );
  console.log("Continuing after manual email verification");
}
