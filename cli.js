#!/usr/bin/env node

var inquirer = require('inquirer');
var path = require('path');
var fs = require('fs');

const QUESTION_PATH_JSON = {
  type: 'input',
  name: 'pathJSON',
  message: 'Path to JSON file exported via ae-to-json:',
  validate: Boolean
};

const QUESTION_PATH_OUT = {
  type: 'input',
  name: 'pathOut',
  message: 'Path to output ui to:',
  default: path.join(__dirname, 'ui-export')
};

const QUESTION_EXPORTER = {
  type: 'list',
  name: 'exporter',
  message: 'Select which f1 platform you\'d like to export for:',
  choices: [
    'react-f1',
    'f1-dom'
  ]
};

var args = process.argv.slice(2);
var questions = [];
var pathJSON;
var pathOut;
var exporter;

[ pathJSON, pathOut, exporter ] = args; 

if(!pathJSON) {
  questions.push(QUESTION_PATH_JSON);
}

if(!pathOut) {
  questions.push(QUESTION_PATH_OUT);
}

if(!exporter) {
  questions.push(QUESTION_EXPORTER);
}

// if we have questions then prompt
if(questions.length) {

  inquirer.prompt(questions)
  .then((response) => {
    pathJSON = pathJSON || response.pathJSON;
    pathOut = pathOut || response.pathOut;
    exporter = exporter || response.exporter;

    doExport();  
  });
// otherwise jsut export the content using the exporter
} else {
  doExport();
}

function doExport() {
  var pathExporter = path.join(__dirname, 'exporters', exporter);

  // check that the input file exists
  if(!fs.existsSync(pathJSON)) {
    console.log('It seems that the path to the JSON file exporter via ae-to-json does not exist');
  // check that the exporter exists
  } else if(!fs.existsSync(pathExporter)) {
    console.log('It seems that the ' + exporter + ' exporter is not supported at this time');
  }

  exporter = require(pathExporter);

  exporter({
    pathJSON: pathJSON,
    pathOut: pathOut
  });
}