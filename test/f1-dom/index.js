var f1Dom = require('../../f1-dom');
var path = require('path');
var fs = require('fs');
var budo = require('budo');

var OUT_PATH = path.join(__dirname, 'test-f1-dom');

if(!fs.existsSync(OUT_PATH)) {
  fs.mkdirSync(OUT_PATH);  
}

f1Dom({
  pathJSON: path.join(__dirname, '..', 'ae-export.json'),
  pathOut: OUT_PATH
});


// fs.writeFileSync(path.join(__dirname, 'statesTransitions.js'), outJS);

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