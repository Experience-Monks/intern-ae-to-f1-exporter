var fs = require('fs');
var path = require('path');
var serializeJS = require('serialize-javascript');
var template = require('es6-template-strings');

var aeToF1 = require('../../src/');
var getTargets = require('../../src/getTargets');
var getHTML = require('./getHTML');
var copyAssetsFromTargets = require('../../src/copyAssetsFromTargets');
var outputAnimationJSON = require('../../src/exporter/outputAnimationJSON');
var getMultiComp = require('../../src/util/getMultiComp');

module.exports = function(opts) {
  if(opts.pathJSON === undefined) {
    throw new Error('you must pass in `pathJSON` where an After Effects json file exists');
  }

  if(opts.pathOut === undefined) {
    throw new Error('you must pass in `pathOut` where assets + js will be written');
  }

  // read in data needed for export
  var json = JSON.parse(fs.readFileSync(opts.pathJSON));

  var components = getMultiComp(json);
  // multiple components
  if(components.length > 1 ) {
    components.forEach(function(comp) {
      var outPath = path.join(opts.pathOut, comp.name);
      fs.mkdirSync(outPath);
      generateIndividualComp(outPath, comp, json);
    });
  }
  else {
    // convert after effects json data to something useable
    var animationData = aeToF1(json);
  
      outputAnimationJSON(opts, json, animationData);
      outputTargets(opts, json, animationData);
      outputIndexJS(opts, json, animationData);    
  }

};

function generateIndividualComp(path, comp, json) {
  json.project.items = comp.items;
  var animationData = aeToF1(json);
  var opts = {};
  opts.pathOut = path + '/';

  outputAnimationJSON(opts, json, animationData);
  outputTargets(opts, json, animationData);
  outputIndexJS(opts, json, animationData);    
}

function outputTargets(opts, json, animationData) {
  var targets = getTargets(json);

  copyAssetsFromTargets(targets, opts.pathOut, function() {
    Object.keys(targets).forEach(function(targetName) {
      var target = targets[ targetName ];
      var fileName;

      if(target.src) {
        fileName = path.basename(target.src);

        target.src = fileName;
      }
    });

    fs.writeFileSync(path.join(opts.pathOut, 'targets.json'), JSON.stringify(targets, null, '  '));
  });
}

function outputIndexJS(opts, json, animationData) {
  var templateIndex = fs.readFileSync(path.join(__dirname, 'template-index.js'));
  
  var outIndex = template(templateIndex, {
    jsx: getHTML(json, opts)
  });

  fs.writeFileSync(path.join(opts.pathOut, 'index.js'), outIndex);
}