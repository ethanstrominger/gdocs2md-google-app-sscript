namespace utils {
  function appendTextArgs(fileName, textArgs) {
    var fileList = DriveApp.getFilesByName(fileName);
    var fileText = "";

    for (var j = 0; j < textArgs.length; j++) {
      fileText = fileText + " " + textArgs[j];
    }

    if (fileList.hasNext()) {
      // found matching file - append text
      var file = fileList.next();
      var combinedContent = file.getBlob().getDataAsString() + "\n" + fileText;
      file.setContent(combinedContent);
    } else {
      // file not found - create new
      console.log("creating file text", fileText);
      DriveApp.createFile(fileName, fileText);
    }
  }

  export function getFolder(folderName) {
    var dirs = folderName.split("/");
    DriveApp.getFolders().next();
    console.log("getting folders");
    var folder = DriveApp.getFoldersByName(dirs[0]).next();
    for (var x = 1; x < dirs.length; x++) {
      var dirName = dirs[x];
      if (dirName) {
        folder = folder.getFoldersByName(dirName).next();
      }
    }
    return folder;
  }
}
