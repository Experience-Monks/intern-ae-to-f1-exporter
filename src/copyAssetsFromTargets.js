var path = require('path');
var child_process = require('child_process');
var getSvgFromIllustrator = require('../exporters/utils/getSvgFromIllustrator');
var shellEscape = require('shell-escape');

var async = require('async');
var fs = require('fs');

// this function is meant to receive parsed targets and to 
// copy all files to output folder
module.exports = function(targets, pathOutFolder, callback) {
  var commands = [];

  var pathAssetOutFolder = path.join(pathOutFolder, 'assets');

  if(!fs.existsSync(pathAssetOutFolder)) {
    fs.mkdirSync(pathAssetOutFolder); 
  }

  Object.keys(targets)
  .forEach(function(nameTarget) {
    var target = targets[ nameTarget ];
    var inFile = target.src.split('(').join('\\(').split(')').join('\\)');
    var outFile = path.join(pathAssetOutFolder, path.basename(inFile));

    if(!fs.existsSync(target) && target.src.split('.')[1] === 'svg') {
      var res = getSvgFromIllustrator(target.src.replace(/[.]svg/g, '.ai'), pathAssetOutFolder);
      if(!res) throw new Error('error converting ai file into svg');
    }
    else if(inFile) {
      commands.push('cp ' + shellEscape([inFile]) + ' ' + shellEscape([outFile]));  
    }
  }); 
  
  commands.forEach(function(command) {
    child_process.execSync(command);
  });
  if(callback) callback();
};