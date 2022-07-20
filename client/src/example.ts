var fs = require("fs");
var readline = require("readline");
import * as google from "googleapis";
import { authorizePromise } from "./authorizePromise";
var googleAuth = require("google-auth-library");

var SCOPES = ["https://www.googleapis.com/auth/drive"];
var TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  "/.credentials/";
var TOKEN_PATH = TOKEN_DIR + "script-nodejs-quickstart.json";

// Load client secrets from a local file.
// fs.readFile("client_secret.json", function processClientSecrets(err, content) {
//   if (err) {
//     console.log("Error loading client secret file: " + err);
//     return;
//   }
//   // Authorize a client with the loaded credentials, then call the
//   // Google Apps Script Execution API.
//   authorize(JSON.parse(content), callAppsScript);
// });
main();
async function main() {
  const auth = await authorizePromise();
  callAppsScript(auth);
}

function callAppsScript(auth) {
  var scriptId = "1FP52xxqyQ0BoIO7DG_2Q1l5oVr48G_tmuJgRVHT_00t7bXFRpz1Vi5T2";
  var script = new google.script_v1.Script({ auth });

  // Make the API request. The request object is included here as 'resource'.
  console.log("running", auth);
  script.scripts.run({ auth: auth, scriptId: scriptId }, function (err, resp) {
    if (err) {
      // The API encountered a problem before the script started executing.
      console.log("The API returned an error: " + err);
      return;
    }
    if (resp.error) {
      // The API executed, but the script returned an error.

      // Extract the first (and only) set of error details. The values of this
      // object are the script's 'errorMessage' and 'errorType', and an array
      // of stack trace elements.
      var error = resp.error.details[0];
      console.log("Script error message: " + error.errorMessage);
      console.log("Script error stacktrace:");

      if (error.scriptStackTraceElements) {
        // There may not be a stacktrace if the script didn't start executing.
        for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
          var trace = error.scriptStackTraceElements[i];
          console.log("\t%s: %s", trace.function, trace.lineNumber);
        }
      }
    } else {
      // The structure of the result will depend upon what the Apps Script
      // function returns. Here, the function returns an Apps Script Object
      // with String keys and values, and so the result is treated as a
      // Node.js object (folderSet).
      var folderSet = resp.response.result;
      if (Object.keys(folderSet).length == 0) {
        console.log("No folders returned!");
      } else {
        console.log("Folders under your root folder:");
        Object.keys(folderSet).forEach(function (id) {
          console.log("\t%s (%s)", folderSet[id], id);
        });
      }
    }
  });
}
