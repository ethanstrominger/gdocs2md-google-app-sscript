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
function callAppsScript(auth) {
  var scriptId = process.env.SCRIPT_ID;
  console.log("Script ID: ", scriptId);
  var script = new google.script_v1.Script({});

  // Make the API request. The request object is included here as 'resource'.
  console.log("running", auth);
  script.scripts.run(
    {
      auth: auth,
      scriptId: scriptId,
      requestBody: { function: "doGet", devMode: true },
    },
    function (err, resp) {
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
        console.log(
          "debug",
          resp,
          "response",
          Object.keys(resp),
          Object.values(resp),
          // "resp data",
          // Object.keys(resp.data),
          // "xxxxx",
          // Object.values(resp.data),
          // "xxxxx",
          // Object.keys(resp.data.response),
          // "xxxxx",
          // Object.values(resp.data.response),
          JSON.stringify(resp)
        );
        var folderSet = resp.data.response;
        if (Object.keys(folderSet).length == 0) {
          console.log("No folders returned!");
        } else {
          console.log("Folders under your root folder:");
          Object.keys(folderSet).forEach(function (id) {
            console.log("\t%s (%s)", folderSet[id], id);
          });
        }
      }
    }
  );
}
