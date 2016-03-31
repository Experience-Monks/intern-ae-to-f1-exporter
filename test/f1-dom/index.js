var aeToF1 = require('../../src/');
var f1Dom = require('../../src/statesConverter/f1-dom');
var json = require('../ae-export');
var toJSString = require('serialize-javascript');
var fs = require('fs');
var path = require('path');
var budo = require('budo');

var statesTransitions = 'module.exports = ' + toJSString(f1Dom(aeToF1(json)), '  ');

fs.writeFileSync(path.join(__dirname, 'statesTransitions.js'), statesTransitions);

budo(
  path.join(__dirname, 'frontend.js'),
  {
    dir: path.join(__dirname, '..', 'ae', '(Footage)', 'Images'),
    open: true,
    port: 8000
  }
)
.on('connect', function() {
  console.log('up and runnning on :8000');
});

