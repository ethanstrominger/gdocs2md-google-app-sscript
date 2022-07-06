import * as fs from "fs";
import * as readline from "readline";
import { GaxiosResponse } from "gaxios";
import { docs_v1, drive_v3, google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { docs } from "googleapis/build/src/apis/docs";
import { getHtml } from "./convert";
const inputFolderKey = "inputfolder";
const outputFolderKey = "outputfolder";
const fileNameKey = "filenamekey";
const docsApi = docs("v1");
const args = new Map();
setDefaultArgValues(args);

process.argv.forEach((val) => {
  if (val.includes("=")) {
    const keyValue = val.split("=");
    args.set(keyValue[0], keyValue[1]);
  }
});

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
// Authorize a client with credentials, then call the Google Docs API.
const inputFolder = args.get(inputFolderKey);
main({ inputFolder });
// if (auth) {
//   main(auth);
// }

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials: {
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

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */
async function main({ inputFolder }: { inputFolder: string }) {
  const content = fs.readFileSync("credentials.json").toString();
  const auth = await authorize(JSON.parse(content));
  if (!auth) {
    return;
  }
  const drive = google.drive({ version: "v3", auth });
  const folderIterator = await drive.files.list({
    q: `name='${inputFolder}'`,
  });
  let folder: drive_v3.Schema$File | undefined;
  folderIterator.data.files?.forEach((firstFolder) => {
    folder = firstFolder;
  });
  if (!folder) return;
  const folderObj = await drive.files.get({ fileId: folder?.id });
  await processFolder({
    folderObj,
    drive,
    fullDirName: folderObj.data.name || "",
    auth,
  });
}

async function processFolder({
  folderObj,
  drive,
  fullDirName,
  auth,
}: {
  folderObj: GaxiosResponse<drive_v3.Schema$File>;
  drive: drive_v3.Drive;
  fullDirName: string;
  auth: any;
}) {
  const childrenObj = await drive.files.list({
    q: `"${folderObj.data.id}" in parents`,
  });

  childrenObj.data.files?.forEach(async (file: drive_v3.Schema$File) => {
    console.log("file/folder", fullDirName, file.name);
    if (file.mimeType?.includes("folder")) {
      const folderObj = await drive.files.get({ fileId: file.id });
      processFolder({
        folderObj,
        drive,
        fullDirName: fullDirName + "/" + file.name,
        auth,
      });
    } else if (file.mimeType?.includes("doc")) {
      const docs = google.docs({
        version: "v1",
        auth,
      });
      const doc = await docs.documents.get({ documentId: file.id });
      console.log("doc", file.name, doc.data.body?.content);
      const elements = doc.data.body?.content;
      const htmlLines: string[] = [];
      elements?.forEach((paragraph) => {
        addParagraph(paragraph, htmlLines);
      });
      console.log("html", htmlLines);
      // const html = getHtml(doc.data.body);
    }
  });
}

function addParagraph(
  paragraph: docs_v1.Schema$StructuralElement,
  htmlLines: string[]
) {
  const childElements = paragraph.paragraph?.elements;
  if (childElements) {
    childElements.forEach((childElement) => {
      let text = childElement.textRun?.content || "";
      const style = childElement.textRun?.textStyle;
      const boldIt = style?.bold;
      const htmlStyle = "bold";
      text = checkForStyle({ doStyle: style?.bold, text, htmlStyle: "bold" });
      text = checkForStyle({ doStyle: style?.italic, text, htmlStyle: "i" });
      console.log("debug", text, style);
      htmlLines.push(text || "");
    });

    console.log("element.paragraph.elements", paragraph.paragraph?.elements);
  }
}

function checkForStyle({
  doStyle,
  text,
  htmlStyle,
}: {
  doStyle: boolean | undefined;
  text: string;
  htmlStyle: string;
}) {
  if (doStyle) {
    text = `<${htmlStyle}>${text}</${htmlStyle}>`;
  }
  return text;
}

function setDefaultArgValues(args: Map<String, String>) {
  args.set(inputFolderKey, "full");
  args.set(outputFolderKey, "./output-html-from-google-docs");
  args.set(fileNameKey, "");
}
