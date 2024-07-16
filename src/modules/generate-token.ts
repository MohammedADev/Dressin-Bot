import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import dotenv from "dotenv";
import { getEnvVariable } from "../utils/getEnv";

// Load environment variables from .env file
dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

const CLIENT_ID = getEnvVariable("CLIENT_ID");
const CLIENT_SECRET = getEnvVariable("CLIENT_SECRET");
const REDIRECT_URIS = getEnvVariable("REDIRECT_URIS")
  ? getEnvVariable("REDIRECT_URIS").split(",")
  : [];
const TOKEN_PATH = "./src/gmail-tester/token.json";

// Load client secrets from environment variables.
const credentials = {
  web: {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uris: REDIRECT_URIS,
  },
};

authorize(credentials, getNewToken);

/**
 * Create an OAuth2 client with the given credentials.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials: any, callback: any) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err || !token) {
      return getNewToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token.toString()));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client: any, callback: any) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code: string) => {
    rl.close();
    oAuth2Client.getToken(code, (err: any, token: any) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
