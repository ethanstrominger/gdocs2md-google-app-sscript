// import "google-apps-script";
// import { getHtml } from "./convert";
// import { getFolders } from "./utils
export function doGet(e) {
  console.log("doGet parameters", JSON.stringify(e));
  var action = e?.action || "getfiles";
  var inputFolderName = e?.inputFolderName || "test";
  var fileName = e?.fileName || "all";
  return mainProcess({ action, inputFolderName, fileName });
}

function mainProcess(options) {
  var fileList = [];
  if (options.action === "getfiles") {
    let folderName = options.inputFolderName;
    if (folderName.endsWith("/")) {
      folderName = folderName.substr(0, folderName.length - 1);
    }
    const lastSlash = folderName.lastIndexOf("/");
    const parentFolderName = folderName.substr(0, lastSlash + 1);
    console.log("parent", parentFolderName);
    const root = utils.getFolder(folderName);
    console.log("root", root);
    if (root.error) {
      return root;
    }
    const rootFolder = root.folder as GoogleAppsScript.Drive.Folder;
    populateFileList(fileList, rootFolder, parentFolderName);
    console.log(fileList);
    return JSON.stringify(fileList);
  } else {
    console.log("calling covertdoc");
    var html = ConvertGoogleDocToCleanHtml(
      options.inputFolderName,
      options.fileName
    );
    console.log("returned from convertdoc", html);
    return html;
  }
}

function ConvertGoogleDocToCleanHtml(folderName, fileName) {
  // todo: change utils.getFolder to return an object with a folder property
  var subFolder = utils.getFolder(folderName);
  if (!subFolder.folder) {
    return subFolder.error;
  }
  var file = subFolder.folder.getFilesByName(fileName).next();
  console.log("file", file.getName());
  var doc = DocumentApp.openById(file.getId());
  console.log("calling getHtml");
  const html = convert.getHtml(doc);
  console.log("returned from getHtml", html);
  return html;
}

function populateFileList(fileList, filesFolder, parentFolderName) {
  console.log("Processing folder", filesFolder.getName());
  var files = filesFolder.getFiles();
  var expandedFolderName = parentFolderName + filesFolder.getName() + "/";
  while (files.hasNext()) {
    var file = files.next();
    fileList.push({ fileName: file.getName(), folderName: expandedFolderName });
  }
  var folders = filesFolder.getFolders();
  while (folders.hasNext()) {
    var folder = folders.next();
    var folderName = folder.getName();
    populateFileList(fileList, folder, expandedFolderName);
  }
}
