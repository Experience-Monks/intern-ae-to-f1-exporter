var fs = require('fs');
var path = require('path');
var serializeJS = require('serialize-javascript');
var template = require('es6-template-strings');
var copyAssetsFromTargets = require('../src/copyAssetsFromTargets');

var aeToF1 = require('../src/');
var convertF1Dom = require('../src/statesConverter/f1-dom');
var getHTML = require('./getHTML');

module.exports = function(opts) {
  if(opts.pathJSON === undefined) {
    throw new Error('you must pass in `pathJSON` where an After Effects json file exists');
  }

  if(opts.pathOut === undefined) {
    throw new Error('you must pass in `pathOut` where assets + js will be written');
  }

  var json = JSON.parse(fs.readFileSync(opts.pathJSON));
  var templateIndex = fs.readFileSync(path.join(__dirname, 'template-index.js'));
  var templateStates = fs.readFileSync(path.join(__dirname, 'template-getStates.js'));
  var templateTransitions = fs.readFileSync(path.join(__dirname, 'template-getTransitions.js'));
  var statesTransitions = convertF1Dom(aeToF1(json));

  var outIndex = template(templateIndex, {
    html: getHTML(json)
  });
  var outGetStates = template(templateStates, {
    javascript: serializeJS(statesTransitions.states, '  ')
  });
  var outGetTransitions = template(templateTransitions, {
    javascript: serializeJS(statesTransitions.transitions, '  ')
  });

  fs.writeFileSync(path.join(opts.pathOut, 'index.js'), outIndex);
  fs.writeFileSync(path.join(opts.pathOut, 'getStates.js'), outGetStates);
  fs.writeFileSync(path.join(opts.pathOut, 'getTransitions.js'), outGetTransitions);

  // now move over assets
  copyAssetsFromTargets(statesTransitions.targets, opts.pathOut);
};