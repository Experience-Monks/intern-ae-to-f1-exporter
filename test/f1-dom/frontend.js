var f1Dom = require('f1-dom');
var opts = require('./statesTransitions');

document.body.innerHTML = '<img data-f1="jam3Logo png" src="jam3Logo.png" width="200" height="200" />';

opts.el = document.body;

var ui = f1Dom(opts);

console.log(opts);

ui.init('out');
ui.go('idle');