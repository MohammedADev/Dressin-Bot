import { check_inbox, Email } from "gmail-tester";
import path from "path";
import fs from "fs";
import { google } from "googleapis";
import { chromium } from "playwright";

const CREDENTIALS_PATH = path.resolve(
  __dirname,
  "../gmail-tester/credentials.json"
);
const GMAIL_TOKEN_PATH = path.resolve(__dirname, "../gmail-tester/token.json");

// Read credentials from file
let credentials: any;
try {
  const rawCredentials = fs.readFileSync(CREDENTIALS_PATH, "utf-8");
  credentials = JSON.parse(rawCredentials);
} catch (error) {
  console.error("Error reading credentials file:", error);
  process.exit(1);
}

async function refreshToken() {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  try {
    const token = fs.readFileSync(GMAIL_TOKEN_PATH, "utf-8");
    oAuth2Client.setCredentials(JSON.parse(token));
    const { credentials: newToken } = await oAuth2Client.refreshAccessToken();
    fs.writeFileSync(GMAIL_TOKEN_PATH, JSON.stringify(newToken));
    console.log("Token refreshed and saved.");
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error; // Rethrow to handle in caller
  }
}

async function verifyEmailWithPlaywright(
  verificationLink: string
): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate directly to the verification link
    await page.goto(verificationLink);

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    console.log("Navigated to verification link");

    // Add additional steps if necessary, such as clicking a confirm button
    // Wait for a moment to ensure the verification is complete
    await page.waitForTimeout(5000);
  } catch (error) {
    console.error("Error during email verification:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

export async function waitForEmail(
  maxWaitTime: number = 300000,
  checkInterval: number = 10000
): Promise<void> {
  const startTime = Date.now();
  const startDate = new Date();

  while (Date.now() - startTime < maxWaitTime) {
    try {
      await refreshToken();
      const messages: Email[] = await check_inbox(
        credentials,
        GMAIL_TOKEN_PATH,
        {
          subject: "Verify your DRESSIN email",
          from: "systems@dressin.com",
          include_body: true,
          after: startDate,
          wait_time_sec: 10,
          max_wait_time_sec: 30,
        }
      );

      if (messages.length > 0) {
        console.log(`Found ${messages.length} message(s)`);
        const latestMessage = messages[0]; // Assume the first message is the latest

        const emailBody = latestMessage.body?.html || latestMessage.body?.text;
        if (emailBody) {
          const verificationLink = extractVerificationLink(emailBody);
          if (verificationLink) {
            console.log("Attempting to verify email");
            await verifyEmailWithPlaywright(verificationLink);
            console.log("Email verification completed");
            return;
          } else {
            console.log("Verification link not found in email body");
          }
        } else {
          console.log("Email body is empty");
        }
      } else {
        console.log(
          "No new confirmation email found. Waiting before next check..."
        );
      }

      await new Promise((resolve) => setTimeout(resolve, checkInterval));
    } catch (error) {
      console.error("Error checking for email:", error);
      await new Promise((resolve) => setTimeout(resolve, checkInterval));
    }
  }

  console.log("Timeout reached. No confirmation email found or verified.");
}

function extractVerificationLink(emailBody: string): string | null {
  // Relaxed regex to capture the URL with ?u= parameter
  const linkRegex = /https:\/\/links\.newsletter\.dressin\.com[^"]+\?u=[^"]+/;
  const match = emailBody.match(linkRegex);
  console.log("found match");
  return match ? match[0] : null;
}
