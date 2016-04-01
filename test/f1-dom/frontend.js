var getUI = require('./test-f1-dom');

var ui = getUI({
  el: document.body
});

ui.init('out');
ui.go('idle');