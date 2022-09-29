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
      DriveApp.createFile(fileName, fileText);
    }
  }

  export function getFolder(inputFolderName) {
    const dirs = inputFolderName.split("/");
    let folder = DriveApp.getRootFolder();
    let dirName = "";

    for (var x = 0; x < dirs.length; x++) {
      dirName = dirName + dirs[x] + "/";
      console.log(dirName, dirs);
      const matchingFolders = folder.getFoldersByName(dirs[x]);
      if (!matchingFolders.hasNext()) {
        throw `Cannot find dir ${dirName}`;
      }
      folder = matchingFolders.next();
    }
    return { folder };
  }
}
