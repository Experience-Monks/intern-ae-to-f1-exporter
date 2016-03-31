var aeToF1 = require('../src/');
var json = require('./ae-export');
var toJSString = require('serialize-javascript');

console.log(toJSString(aeToF1(json), '  '));
