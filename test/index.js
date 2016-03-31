var aeToF1 = require('../src/');
var f1Dom = require('../src/converter/f1-dom');
var json = require('./ae-export');
var toJSString = require('serialize-javascript');

console.log(toJSString(
  f1Dom(aeToF1(json)), '  '
));
