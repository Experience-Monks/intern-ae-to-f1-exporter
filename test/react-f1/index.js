var exporterF1Dom = require('../../exporters/react-f1');
var path = require('path');
var fs = require('fs');
var budo = require('budo');

var OUT_PATH = path.join(__dirname, 'test-react-f1');

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
    dir: path.join(__dirname, 'test-react-f1'),
    port: 8000
  }
)
.on('connect', function() {
  console.log('up and runnning on :8000');
});