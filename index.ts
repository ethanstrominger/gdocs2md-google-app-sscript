import * as fs from "fs";
import { GaxiosResponse } from "gaxios";
import { docs_v1, drive_v3, google } from "googleapis";
import { docs } from "googleapis/build/src/apis/docs";
import { getHtml } from "./convert";
import { authorize } from "./authorize";
const inputFolderKey = "inputfolder";
const outputFolderKey = "outputfolder";
const fileNameKey = "filenamekey";
const docsApi = docs("v1");
const args = new Map();

setArgs(args);

// If modifying these scopes, delete token.json.
export const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
export const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
// Authorize a client with credentials, then call the Google Docs API.
const inputFolder = args.get(inputFolderKey);
main({ inputFolder });
function setArgs(argsParam: Map<string, string>) {
  setDefaultArgValues(argsParam);
  process.argv.forEach((val) => {
    if (val.includes("=")) {
      const keyValue = val.split("=");
      argsParam.set(keyValue[0], keyValue[1]);
    }
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
  const docs = google.docs({
    version: "v1",
    auth,
  });
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
      await getHtml(docs, file);
      // const html = getHtml(doc.data.body);
    }
  });
}



function setDefaultArgValues(args: Map<String, String>) {
  args.set(inputFolderKey, "full");
  args.set(outputFolderKey, "./output-html-from-google-docs");
  args.set(fileNameKey, "");
}
