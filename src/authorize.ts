import * as fs from "fs";
import * as readline from "readline";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { TOKEN_PATH, SCOPES } from "./index";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
export async function authorize(credentials: {
  installed: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  let token: string;
  try {
    token = fs.readFileSync(TOKEN_PATH).toString();
  } catch (err) {
    const f = await getNewTokenPromise(oAuth2Client);
    return oAuth2Client;
  }
  oAuth2Client.setCredentials(JSON.parse(token));
  return oAuth2Client;
}
function getNewTokenPromise(oAuth2Client: OAuth2Client) {
  return new Promise((resolve) => getNewToken(oAuth2Client, resolve));
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client: OAuth2Client, callback: Function) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      if (!token) return;
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback();
    });
  });
}
