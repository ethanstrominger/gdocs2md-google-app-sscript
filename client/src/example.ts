import * as google from "googleapis";
import { authorizePromise } from "./authorizePromise";
import * as dotenv from "dotenv";
import * as type from "./types";
import { OAuth2Client } from "google-auth-library";
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
    callAppsScript(auth, parameters as type.GetFilesParam);
  } else {
    convertAllHtml(auth, parameters as type.ConvertDocsParam);
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
  var folderSet = resp.data.response;
  console.log("Folders under your root folder:");
  Object.keys(folderSet).forEach(function (id) {
    console.log("\t%s (%s)", folderSet[id], id);
  });
  return folderSet;
}

async function convertAllHtml(
  auth: OAuth2Client,
  parameters: type.ConvertDocsParam
) {
  const filesJson = await getFiles(auth, parameters as type.ConvertDocsParam);
  const files = JSON.parse(filesJson.result) as [
    { folderName: string; fileName: string }
  ];
  files.forEach(async (file) => {
    const resp = await callAppsScript(auth, {
      action: "getHtml",
      folderName: file.folderName,
      fileName: file.fileName,
    });
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
