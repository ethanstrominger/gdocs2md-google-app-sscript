import * as google from "googleapis";
import { authorizePromise } from "./authorizePromise";
import * as dotenv from "dotenv";
dotenv.config();

main();
async function main() {
  const auth = await authorizePromise();
  console.log("abut to call");
  callAppsScript(auth);
}

/**
 * Call an Apps Script function to list the folders in the user's root
 * Drive folder.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function callAppsScript(auth) {
  var scriptId = process.env.SCRIPT_ID;
  console.log("Script ID: ", scriptId);
  var script = new google.script_v1.Script({});

  // Make the API request. The request object is included here as 'resource'.
  console.log("running", auth);
  const parameters = [
    {
      inputFolderName: process.env.INPUT_FOLDER || "test",
      action: process.env.ACTION || "getfiles",
      fileName: process.env.FILENAME || "all2",
      outputFileName: process.env.OUTPUT_FOLDER || "output",
    },
  ];
  let resp;
  try {
    resp = await script.scripts.run({
      auth: auth,
      scriptId: scriptId,
      requestBody: { function: "doGet", parameters, devMode: true },
    });
  } catch (err) {
    if (err) {
      // The API encountered a problem before the script started executing.
      console.log("The API returned an error: " + err);
      return;
    }
  }
  console.log("debug data", resp.data);
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
}
