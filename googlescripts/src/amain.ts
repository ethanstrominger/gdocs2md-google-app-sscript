// import "google-apps-script";
// import { getHtml } from "./convert";

import { createImportSpecifier } from "typescript";

// import { getFolders } from "./utils
export function doGet(e) {
  const params = Array.isArray(e) ? e[0] : e;
  console.log("doGet parameters", params);
  var action = params?.action || "getFiles";
  var inputFolderName = params?.inputFolderName || "test";
  inputFolderName = inputFolderName.replace("/", "");
  var fileName = params?.fileName || "all";
  const m = mainProcess({ action, inputFolderName, fileName });
  return m;
}

function mainProcess(options) {
  var fileList = [];
  if (options.action === "getFiles") {
    return getFiles(options);
  } else {
    var html = getHtml(options.inputFolderName, options.fileName);
    console.log("html", html);
    return html;
  }
}

function convertFiles(options: any) {
  const files = getFiles(options);
  var html = getHtml(options.inputFolderName, options.fileName);
  return html;
}

function getFiles(options: any) {
  const fileList = [] as unknown as [
    { inputFolderName: string; fileName: string }
  ];
  let inputFolderName = options.inputFolderName;
  if (inputFolderName.endsWith("/")) {
    inputFolderName = inputFolderName.substr(0, inputFolderName.length - 1);
  }
  const lastSlash = inputFolderName.lastIndexOf("/");
  const parentFolderName = inputFolderName.substr(0, lastSlash + 1);
  const root = utils.getFolder(inputFolderName);
  const rootFolder = root.folder as GoogleAppsScript.Drive.Folder;
  populateFileList(fileList, rootFolder, parentFolderName);
  return JSON.stringify(fileList);
}

async function getHtml(inputFolderName, fileName) {
  // todo: change utils.getFolder to return an object with a folder property
  var subFolder = utils.getFolder(inputFolderName);
  var file = subFolder.folder.getFilesByName(fileName).next();
  var doc = DocumentApp.openById(file.getId());
  console.log("calling getHtml");
  const html = convert.getHtml(doc);
  console.log("returned from getHtml", html);
  return html;
}

function populateFileList(fileList, folder, parentFolderName) {
  var files = folder.getFiles();
  var expandedFolderName = parentFolderName + folder.getName() + "/";
  while (files.hasNext()) {
    var file = files.next();
    fileList.push({
      fileName: file.getName(),
      inputFolderName: expandedFolderName,
    });
  }
  var folders = folder.getFolders();
  while (folders.hasNext()) {
    var folder = folders.next();
    var inputFolderName = folder.getName();
    populateFileList(fileList, folder, expandedFolderName);
  }
}
