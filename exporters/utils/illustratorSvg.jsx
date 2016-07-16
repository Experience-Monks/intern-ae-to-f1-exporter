
illustratorExport(arguments[0], arguments[1]);

function illustratorExport(src, outpath) {
  fileRef = new File(src);
  app.open(fileRef);
  // uncomment to suppress Illustrator warning dialogs
  app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
  try {
    if (app.documents.length > 0 ) {
      var destFolder = outpath;
      if (destFolder != null) {
        var options, i, sourceDoc, targetFile;  
        options = getOptions();
        sourceDoc = app.activeDocument; // returns the document object
        targetFile = getTargetFile(sourceDoc.name, '.svg', destFolder);
        sourceDoc.exportFile(targetFile, ExportType.SVG, options);
      }
      return targetFile;
    }
    else{
      throw new Error('There are no documents open!');
    }
  }
  catch(e) {
    throw new Error( e.message, "Script Alert", true);
  }
  
  function getOptions()
  {
    var options = new ExportOptionsSVG();
    // For example, uncomment to set the compatibility of the generated svg to SVG Tiny 1.1 
    // options.DTD = SVGDTDVersion.SVGTINY1_1; 
    return options;
  }
  function getTargetFile(docName, ext, destFolder) {
    var newName = "";
    if (docName.indexOf('.') < 0) {
      newName = docName + ext;
    } else {
      var dot = docName.lastIndexOf('.');
      newName += docName.substring(0, dot);
      newName += ext;
    }
    // Create the file object to save to
    var myFile = new File( destFolder + '/' + newName );
    // Preflight access rights
    if (myFile.open("w")) {
      myFile.close();
    }
    else {
      throw new Error('Access is denied');
    }
    return myFile;
  }
}