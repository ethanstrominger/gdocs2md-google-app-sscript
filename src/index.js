"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var readline = require("readline");
var googleapis_1 = require("googleapis");
var inputFolderKey = "inputfolder";
var outputFolderKey = "outputfolder";
var fileNameKey = "filenamekey";
var args = new Map();
setDefaultArgValues(args);
process.argv.forEach(function (val) {
    if (val.includes("=")) {
        var keyValue = val.split("=");
        args.set(keyValue[0], keyValue[1]);
    }
});
// If modifying these scopes, delete token.json.
var SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
var TOKEN_PATH = "token.json";
// Load client secrets from a local file.
// Authorize a client with credentials, then call the Google Docs API.
var inputFolder = args.get(inputFolderKey);
main({ inputFolder: inputFolder });
// if (auth) {
//   main(auth);
// }
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, client_secret, client_id, redirect_uris, oAuth2Client, token, err_1, f;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = credentials.installed, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris;
                    oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 2, , 4]);
                    token = fs.readFileSync(TOKEN_PATH).toString();
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _b.sent();
                    return [4 /*yield*/, getNewTokenPromise(oAuth2Client)];
                case 3:
                    f = _b.sent();
                    return [2 /*return*/, oAuth2Client];
                case 4:
                    oAuth2Client.setCredentials(JSON.parse(token));
                    return [2 /*return*/, oAuth2Client];
            }
        });
    });
}
function getNewTokenPromise(oAuth2Client) {
    return new Promise(function (resolve) { return getNewToken(oAuth2Client, resolve); });
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    var authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question("Enter the code from that page here: ", function (code) {
        rl.close();
        oAuth2Client.getToken(code, function (err, token) {
            if (err)
                return console.error("Error retrieving access token", err);
            if (!token)
                return;
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
                if (err)
                    console.error(err);
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
function main(_a) {
    var _b;
    var inputFolder = _a.inputFolder;
    return __awaiter(this, void 0, void 0, function () {
        var content, auth, drive, folderIterator, folder, folderObj;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    content = fs.readFileSync("credentials.json").toString();
                    return [4 /*yield*/, authorize(JSON.parse(content))];
                case 1:
                    auth = _c.sent();
                    if (!auth) {
                        return [2 /*return*/];
                    }
                    drive = googleapis_1.google.drive({ version: "v3", auth: auth });
                    return [4 /*yield*/, drive.files.list({
                            q: "name='".concat(inputFolder, "'")
                        })];
                case 2:
                    folderIterator = _c.sent();
                    (_b = folderIterator.data.files) === null || _b === void 0 ? void 0 : _b.forEach(function (firstFolder) {
                        folder = firstFolder;
                    });
                    if (!folder)
                        return [2 /*return*/];
                    return [4 /*yield*/, drive.files.get({ fileId: folder === null || folder === void 0 ? void 0 : folder.id })];
                case 3:
                    folderObj = _c.sent();
                    return [4 /*yield*/, processFolder({
                            folderObj: folderObj,
                            drive: drive,
                            fullDirName: folderObj.data.name || ""
                        })];
                case 4:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function processFolder(_a) {
    var _b;
    var folderObj = _a.folderObj, drive = _a.drive, fullDirName = _a.fullDirName;
    return __awaiter(this, void 0, void 0, function () {
        var childrenObj;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, drive.files.list({
                        q: "\"".concat(folderObj.data.id, "\" in parents")
                    })];
                case 1:
                    childrenObj = _c.sent();
                    (_b = childrenObj.data.files) === null || _b === void 0 ? void 0 : _b.forEach(function (file) { return __awaiter(_this, void 0, void 0, function () {
                        var folderObj_1;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    console.log("file/folder", fullDirName, file.name);
                                    if (!((_a = file.mimeType) === null || _a === void 0 ? void 0 : _a.includes("folder"))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, drive.files.get({ fileId: file.id })];
                                case 1:
                                    folderObj_1 = _b.sent();
                                    processFolder({
                                        folderObj: folderObj_1,
                                        drive: drive,
                                        fullDirName: fullDirName + "/" + file.name
                                    });
                                    _b.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function setDefaultArgValues(args) {
    args.set(inputFolderKey, "test-html-from-googledocs");
    args.set(outputFolderKey, "./output-html-from-google-docs");
    args.set(fileNameKey, "");
}
