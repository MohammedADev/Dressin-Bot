import { check_inbox, Email } from "gmail-tester";
import path from "path";
import fs from "fs";
import { google } from "googleapis";
import { chromium, Browser, Page } from "playwright";

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
    const newToken = await oAuth2Client.refreshAccessToken();
    fs.writeFileSync(GMAIL_TOKEN_PATH, JSON.stringify(newToken.credentials));
    console.log("Token refreshed and saved.");
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error; // Rethrow to handle in caller
  }
}

async function clickConfirmationLink(link: string) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto(link);
    console.log("Clicked confirmation link:", link);
  } catch (error) {
    console.error("Error clicking confirmation link:", error);
  } finally {
    await browser.close();
  }
}

export async function waitForEmail(
  maxWaitTime: number = 300000, // 5 minutes
  checkInterval: number = 10000 // 10 seconds
): Promise<string | null> {
  const startTime = Date.now();
  const startDate = new Date();
  const processedLinks = new Set<string>();

  while (Date.now() - startTime < maxWaitTime) {
    try {
      await refreshToken();
      const messages = await check_inbox(credentials, GMAIL_TOKEN_PATH, {
        subject: "Verify your DRESSIN email",
        from: "systems@dressin.com",
        include_body: true,
        after: startDate,
        wait_time_sec: 10,
        max_wait_time_sec: 30,
      });

      if (messages.length > 0) {
        console.log(`Found ${messages.length} message(s)`);
        for (const message of messages) {
          const emailBody = message.body?.html || message.body?.text;
          if (emailBody) {
            console.log("Email body:", emailBody); // Log the email body for debugging
            const confirmationLink = findConfirmationLink(emailBody);
            if (confirmationLink) {
              console.log("Found confirmation link:", confirmationLink);
              if (!processedLinks.has(confirmationLink)) {
                console.log("Processing new confirmation link");
                processedLinks.add(confirmationLink);
                await clickConfirmationLink(confirmationLink);
                return confirmationLink;
              } else {
                console.log("Skipping already processed confirmation link");
              }
            } else {
              console.log("No valid confirmation link found in this email");
            }
          } else {
            console.log("Email body is empty");
          }
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

  console.log("Timeout reached. No confirmation email found.");
  return null;
}

function findConfirmationLink(emailBody: string): string | null {
  const confirmationLinkMatch = emailBody?.match(
    /https:\/\/links\.newsletter\.dressin\.com[^\s"]*/
  );
  return confirmationLinkMatch ? confirmationLinkMatch[0] : null;
}
