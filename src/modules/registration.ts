import { Page } from "playwright";
import { typeWithDelay, waitForSelectorAndClick } from "../utils/page-actions";
import { RandomEmail } from "../utils/algo";
import { RegistrationFormData, PageAction } from "../types";
import { getEnvVariable } from "../utils/getEnv";
import { waitForEmail } from "./verify-email";

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
  await waitForEmail()
    .then((confirmationLink) => {
      if (confirmationLink !== undefined) {
        console.log("Email confirmation link:", confirmationLink);
      } else {
        console.log("No confirmation link found within the timeout period.");
      }
    })
    .catch((error) => {
      console.error("Error in email verification process:", error);
    });
}
