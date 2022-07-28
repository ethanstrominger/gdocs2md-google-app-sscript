// import "google-apps-script";
// import { getHtml } from "./convert";

import { createImportSpecifier } from "typescript";

// import { getFolders } from "./utils
export function doGet(e) {
  const params = Array.isArray(e) ? e[0] : e;
  console.log("doGet parameters", params);
  var action = params?.action || "getFiles";
  var folderName = params?.folderName || "test";
  folderName = folderName.replace("/", "");
  var fileName = params?.fileName || "all";
  const m = mainProcess({ action, folderName, fileName });
  return m;
}

function mainProcess(options) {
  var fileList = [];
  if (options.action === "getFiles") {
    return getFiles(options);
  } else {
    var html = getHtml(options.folderName, options.fileName);
    console.log("html", html);
    return html;
  }
}

function convertFiles(options: any) {
  const files = getFiles(options);
  var html = getHtml(options.folderName, options.fileName);
  return html;
}

function getFiles(options: any) {
  const fileList = [] as unknown as [{ folderName: string; fileName: string }];
  let folderName = options.folderName;
  if (folderName.endsWith("/")) {
    folderName = folderName.substr(0, folderName.length - 1);
  }
  const lastSlash = folderName.lastIndexOf("/");
  const parentFolderName = folderName.substr(0, lastSlash + 1);
  const root = utils.getFolder(folderName);
  const rootFolder = root.folder as GoogleAppsScript.Drive.Folder;
  populateFileList(fileList, rootFolder, parentFolderName);
  return JSON.stringify(fileList);
}

async function getHtml(folderName, fileName) {
  // todo: change utils.getFolder to return an object with a folder property
  var subFolder = utils.getFolder(folderName);
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
    fileList.push({ fileName: file.getName(), folderName: expandedFolderName });
  }
  var folders = folder.getFolders();
  while (folders.hasNext()) {
    var folder = folders.next();
    var folderName = folder.getName();
    populateFileList(fileList, folder, expandedFolderName);
  }
}
