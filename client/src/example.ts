import * as google from "googleapis";
import { authorizePromise } from "./authorizePromise";
import * as dotenv from "dotenv";
import * as type from "./types";
import { OAuth2Client } from "google-auth-library";
import * as fs from "fs";
dotenv.config();

main();
async function main() {
  const auth = (await authorizePromise()) as OAuth2Client;
  const parameters = {
    folderName: process.env.INPUT_FOLDER,
    action: process.env.ACTION,
    fileName: process.env.FILENAME,
    outputFolderName: process.env.OUTPUT_FOLDER,
  } as type.Params;
  if (parameters.action.startsWith("get")) {
    await callAppsScript(auth, parameters as type.GetFilesParam);
  } else {
    console.log("debug Calling convert html");
    await convertAllHtml(auth, parameters as type.ConvertDocsParam);
    console.log("debug done");
  }
}

/**
 * Call an Apps Script function to list the folders in the user's root
 * Drive folder.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function callAppsScript(auth, parameters: type.Params) {
  var scriptId = process.env.SCRIPT_ID;
  console.log("Script ID: ", scriptId);
  var script = new google.script_v1.Script({});

  // Make the API request. The request object is included here as 'resource'.
  let resp;
  console.log("debug callappsscript", parameters);
  try {
    resp = await script.scripts.run({
      auth: auth,
      scriptId: scriptId,
      requestBody: {
        function: "doGet",
        parameters: [parameters],
        devMode: true,
      },
    });
    console.log("resp", resp);
  } catch (err) {
    if (err) {
      // The API encountered a problem before the script started executing.
      console.log("The API returned an error: " + err);
      return;
    }
  }
  if (resp.data.error) {
    // The API executed, but the script returned an error.
    var error = resp.data.error.details[0];
    console.log("Script error message: " + error.errorMessage);
    console.log("Script error stacktrace:");
    console.log(error.scriptStackTraceElements);
    throw new Error(error.errorMessage);
  }
  // The structure of the result will depend upon what the Apps Script
  // function returns. Here, the function returns an Apps Script Object
  // with String keys and values, and so the result is treated as a
  // Node.js object (folderSet).
  return resp.data.response.result;
}

async function convertAllHtml(
  auth: OAuth2Client,
  parameters: type.ConvertDocsParam
) {
  console.log("calling getFiles");
  const filesJson = await getFiles(auth, parameters as type.ConvertDocsParam);
  console.log("done get files", filesJson);
  const files = JSON.parse(filesJson) as [
    { folderName: string; fileName: string }
  ];
  console.log("files", files);
  files.forEach(async (file) => {
    console.log("debug file", file);
    const html = await callAppsScript(auth, {
      action: "getHtml",
      folderName: file.folderName,
      fileName: file.fileName,
    });
    console.log("debug html", html);
    fs.mkdirSync(file.folderName, { recursive: true });
    fs.writeFileSync(file.folderName + file.fileName + ".html", html);
  });
}

async function getFiles(auth: OAuth2Client, parameters: type.Params) {
  const params = {
    action: "getFiles",
    folderName: parameters.folderName,
  };
  return await callAppsScript(auth, {
    folderName: parameters.folderName,
  });
}
