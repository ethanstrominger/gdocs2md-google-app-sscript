
function emailHtml(doc, html, images) {
  var attachments = [];
  for (var j=0; j<images.length; j++) {
    attachments.push( {
      "fileName": images[j].name,
      "mimeType": images[j].type,
      "content": images[j].blob.getBytes() } );
  }

  var inlineImages = {};
  for (var j=0; j<images.length; j++) {
    inlineImages[[images[j].name]] = images[j].blob;
  }

  var name = doc.getName()+".html";
  attachments.push({"fileName":name, "mimeType": "text/html", "content": html});
  MailApp.sendEmail({
     to: Session.getActiveUser().getEmail(),
     subject: name,
     htmlBody: html,
     inlineImages: inlineImages,
     attachments: attachments
   });
}

function appendTextArgs ( fileName, textArgs ) {
    var fileList = DriveApp.getFilesByName(fileName);
    var fileText = "";

    for (var j=0; j<textArgs.length; j++) {
      fileText = fileText +" "+textArgs[j];
    }

    if (fileList.hasNext()) {
      // found matching file - append text
      var file = fileList.next();
      var combinedContent = file.getBlob().getDataAsString() + '\n' + fileText;
      file.setContent(combinedContent);
    }
    else {
      // file not found - create new
      console.log('creating file text', fileText);
      DriveApp.createFile(fileName, fileText);
    }
}

function createDocumentForHtml(outputFolder, doc, html, images) {
  console.log(doc.getName());
  var name = doc.getName()+".html";
  var newDoc = DocumentApp.create(name);
  newDoc.getBody().setText(html);
  for(var j=0; j < images.length; j++)
    newDoc.getBody().appendImage(images[j].blob);
  var newDoc = outputFolder.createFile(name, html, MimeType.PLAIN_TEXT);
}

function getOrCreateFolder(name,root){
  
  if (root == null){
    root = DriveApp;
  }
  
  var folderIter = root.getFoldersByName(name);
  
  var folder = null;
  
  if(folderIter.hasNext()){
    folder = folderIter.next();
  }
  
  if(folder == null){
    folder = root.createFolder(name);
  }
  
  return folder;

}

function dumpAttributes(atts) {
  // Log the paragraph attributes.
  for (var att in atts) {
    Logger.log(att + ":" + atts[att]);
  }
}

