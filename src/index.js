const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const inputFolderKey = "inputfolder";
const outputFolderKey = "outputfolder";
const fileNameKey = "filenamekey";
const args = new Map();
setDefaultArgValues(args);

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
// Authorize a client with credentials, then call the Google Docs API.
main();
// if (auth) {
//   main(auth);
// }

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  let token;
  try {
    token = fs.readFileSync(TOKEN_PATH);
  } catch (err) {
    const f = await getNewTokenPromise(oAuth2Client);
    return oAuth2Client;
  }
  oAuth2Client.setCredentials(JSON.parse(token));
  return oAuth2Client;
}

function getNewTokenPromise(oAuth2Client) {
  return new Promise((resolve) => getNewToken(oAuth2Client, resolve));
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
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
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback();
      // callback(oAuth2Client);
    });
  });
}

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */
async function main() {
  const content = fs.readFileSync("credentials.json");
  const auth = await authorize(JSON.parse(content));
  if (!auth) {
    return;
  }
  const drive = google.drive({ version: "v3", auth });
  const folder2 = await drive.files.list({
    q: "name='test-html-from-googledocs'",
  });
  console.log("folder", folder2.data.files);
  const files = folder2.data.files;
  files.forEach(async (element) => {
    const testx = await drive.files.get({ fileId: element.id });
    const children = await drive.files.list({
      q: `"${element.id}" in parents`,
    });
    console.log("children", children.data);
    // children.forEach((file) => {
    //   console.log(file.name);
    // });
  });

  const folder = await drive.files.get({
    fileId: "1LJlF5id-a69ADbg56QK48a8Ufu0b8HRE",
  });
  // for (file in files) {
  //   console.log(file);
  // }
  //   ,
  //   (err, res) => {
  //     if (err) return console.log("The API returned an error: " + err);
  //     console.log(`The title of the document is: ${res.data.title}`);
  //   }
  // );
}

function setDefaultArgValues(args) {
  args.set(inputFolderKey, "test-html-from-googledocs");
  args.set(outputFolderKey, "./output-html-from-google-docs");
  args.set(fileNameKey, "");
}
