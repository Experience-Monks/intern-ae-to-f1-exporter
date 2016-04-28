var exporterF1Dom = require('../../exporters/f1-dom');
var path = require('path');
var fs = require('fs');
var budo = require('budo');

var OUT_PATH = path.join(__dirname, 'test-f1-dom');

if(!fs.existsSync(OUT_PATH)) {
  fs.mkdirSync(OUT_PATH);  
}

exporterF1Dom({
  pathJSON: path.join(__dirname, '..', 'ae-export.json'),
  pathOut: OUT_PATH
});

budo(
  path.join(__dirname, 'frontend.js'),
  {
    live: true,
    dir: path.join(__dirname, 'test-f1-dom'),
    port: 8000
  }
)
.on('connect', function() {
  console.log('up and runnning on :8000');
});