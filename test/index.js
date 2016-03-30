var aeToF1 = require('../src/');
var json = require('./ae-export');

console.log(JSON.stringify(aeToF1(json), null, '  '));
