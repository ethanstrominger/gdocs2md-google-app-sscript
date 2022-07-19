// import "google-apps-script";
// import { getHtml } from "./convert";
// import { getFolders } from "./utils
export function doGet(e) {
  var action = e?.parameter?.action || "getfiles";
  var inputFolderName =
    e?.parameter?.inputfoldername || "test-html-from-googledocs/full/";
  // var action = e?.parameter?.action || 'getfiles'
  // var inputFolderName = e?.parameter?.inputfoldername || 'test-html-from-googledocs'
  var fileName = e?.parameter?.filename || "all";
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
    populateFileList(fileList, root, parentFolderName);
    console.log(fileList);
    return HtmlService.createHtmlOutput(JSON.stringify(fileList));
  } else {
    console.log("calling covertdoc");
    var html = ConvertGoogleDocToCleanHtml(
      options.inputFolderName,
      options.fileName
    );
    console.log("returned from convertdoc", html);
    return HtmlService.createHtmlOutput(html);
  }
}

function ConvertGoogleDocToCleanHtml(folderName, fileName) {
  var subFolder = utils.getFolder(folderName);
  var file = subFolder.getFilesByName(fileName).next();
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
