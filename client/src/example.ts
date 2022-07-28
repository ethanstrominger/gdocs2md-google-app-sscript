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
  const getFilesParams = {
    action: "getFiles",
    inputFolderName: process.env.INPUT_FOLDER,
  };
  const convertParams = {
    inputFolderName: process.env.INPUT_FOLDER,
    action: process.env.ACTION,
    fileName: process.env.FILENAME,
    outputFolderName: process.env.OUTPUT_FOLDER,
  } as type.Params;
  if (process.env.ACTION.startsWith("get")) {
    await callAppsScript(auth, getFilesParams as type.GetFilesParam);
  } else {
    await convertAllHtml(auth, convertParams as type.GetHtmlParam);
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
  parameters: type.GetHtmlParam
) {
  const inputFolderName = addSlash(parameters.inputFolderName);
  const outputFolderName =
    addSlash(parameters.outputFolderName) + inputFolderName;
  const filesJson = await getFiles(auth, parameters as type.GetHtmlParam);
  const files = JSON.parse(filesJson) as [
    { inputFolderName: string; fileName: string }
  ];
  console.log("Processing files", files);
  files.forEach(async (file) => {
    const html = await callAppsScript(auth, {
      action: "getHtml",
      inputFolderName: inputFolderName,
      fileName: file.fileName,
    });
    fs.mkdirSync(outputFolderName, { recursive: true });
    const outputFileName = outputFolderName + file.fileName + ".html";
    fs.writeFileSync(outputFileName, html);
  });
}

function addSlash(folderName) {
  const outputNeedsSlash = folderName.endsWith("/");
  const outputFolderName = folderName + (outputNeedsSlash ? "" : "/");
  return outputFolderName;
}

async function getFiles(auth: OAuth2Client, parameters: type.Params) {
  const params = {
    action: "getFiles",
    inputFolderName: parameters.inputFolderName,
  };
  return await callAppsScript(auth, {
    inputFolderName: parameters.inputFolderName,
  });
}
