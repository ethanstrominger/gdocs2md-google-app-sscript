function doGet(e) {
  var action = e?.parameter?.action || 'gethtml'
  var inputFolderName = e?.parameter?.inputfoldername || 'test-html-from-googledocs/folderb2/'
  // var action = e?.parameter?.action || 'getfiles'
  // var inputFolderName = e?.parameter?.inputfoldername || 'test-html-from-googledocs'
  var fileName = e?.parameter?.filename || 'test4'
  // ConvertGoogleDocToCleanHtml()
  return mainProcess ( { action, inputFolderName, fileName } );
}

function mainProcess ( options ) {
  var fileList = [];
  if ( options.action === 'getfiles' ) {
    var root = DriveApp.getFoldersByName(options.inputFolderName).next();
    populateFileList(fileList, root, '');
    return HtmlService.createHtmlOutput(JSON.stringify(fileList));
  } else {
    var html = ConvertGoogleDocToCleanHtml(options.inputFolderName, options.fileName);
    return HtmlService.createHtmlOutput(html);
  }
}

function ConvertGoogleDocToCleanHtml(folderName, fileName) {
  var subFolder = getFolders(folderName);
  var file = subFolder.getFilesByName(fileName).next();
  console.log('file', file.getName());
  var doc = DocumentApp.openById(file.getId());
  var html = getHtml(doc);
  return html;
}


function populateFileList(fileList, filesFolder, parentFolderName) {
  console.log('Processing folder', filesFolder.getName());
  var files = filesFolder.getFiles();
  var expandedFolderName = parentFolderName + filesFolder.getName() + '/';
  while (files.hasNext()){
    var file = files.next();
    fileList.push({ fileName: file.getName(), folderName: expandedFolderName })
  }
  var folders = filesFolder.getFolders();
  while (folders.hasNext()) {
    var folder= folders.next()
    var folderName = folder.getName();
    populateFileList(fileList, folder, expandedFolderName);
  }
}


// function processFolder(filesFolder, outputFolder) {
//   console.log('Processing folder', filesFolder.getName());
//   var files = filesFolder.getFiles();
//   while (files.hasNext()){
//     var file = files.next()
//     var doc = DocumentApp.openById(file.getId());
//     var images = [];
//     var html = getHtml(doc); 
//     // emailHtml(doc, html, images);
//     createDocumentForHtml(outputFolder, doc, html, images);
//   }
//   var folders = filesFolder.getFolders();
//   while (folders.hasNext()) {
//     var folder= folders.next()
//     var folderName = folder.getName();
//     var matchingFolders = outputFolder.getFoldersByName(folderName);
//     // @ts-ignore
//     if (matchingFolders.hasNext()) {
//       var outputFolder2 = matchingFolders.next();
//     } else {
//       outputFolder2 = outputFolder.createFolder(folderName); 
//     }
//     if (!outputFolder) {
//       outputFolder2 = outputFolder.createFolder(folderName); 
//     }
//     processFolder(folder, outputFolder2);
//   }
// }

// function ConvertGoogleDocsToCleanHtml() {
//   var subFolder = getOrCreateFolder('test-html-from-googledocs');
//   var outputFolder = getOrCreateFolder('html-from-googledocs/elephant');
//   processFolder(subFolder, outputFolder);
// }
