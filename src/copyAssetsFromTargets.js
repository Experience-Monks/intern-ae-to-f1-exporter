var path = require('path');
var child_process = require('child_process');
var getSvgFromIllustrator = require('../exporters/utils/getSvgFromIllustrator');
var shellEscape = require('shell-escape');
var createLayeredSvg = require('./createLayeredSvg');

var async = require('async');
var fs = require('fs-extra');

// this function is meant to receive parsed targets and to 
// copy all files to output folder
module.exports = function(targets, pathOutFolder, layerData, animationData, callback) {
  var commands = [];
  var isLayered;
  var pathAssetOutFolder = path.join(pathOutFolder, 'assets');

  if(!fs.existsSync(pathAssetOutFolder)) {
    fs.mkdirSync(pathAssetOutFolder); 
  }

  Object.keys(targets)
  .forEach(function(nameTarget) {
    var target = targets[ nameTarget ];
    if(target.src) {
      var inFile = target.src.replace(/~/g, process.env.HOME);
      var outFile = path.join(pathAssetOutFolder, path.basename(inFile));
      var isSvg = target.src.split('.')[1] === 'svg';
      var fileName = target.src.split('/')[target.src.split('/').length -1];
      var isNew = !fs.existsSync(pathAssetOutFolder + '/' + fileName);
      var res;
      if(isSvg && isNew) {
        // return a list of svgs, copy is performed in the script.
        res = getSvgFromIllustrator(target.src.replace(/[.]svg/g, '.ai'), pathAssetOutFolder);
        if(!res) throw new Error('error converting ai file into svg');
      }
      else if(inFile && !isSvg) {
        commands.push({
          in: shellEscape([inFile]).replace(/'/g, ''), 
          out: shellEscape([outFile]).replace(/'/g, '')
        });
      }
      // transform svg into multiple svgs if there are layers and write the files
      if((res || isSvg) && layerData.length > 0) {
        var layeredSvg = createLayeredSvg(layerData, nameTarget, res || outFile, animationData);
      }  
    }
  }); 
  
  commands.forEach(function(command) {
    fs.copySync(command.in, command.out);
  });
  if(callback) callback(isLayered ? layerData : undefined);
};