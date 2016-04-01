var getUI = require('./test-f1-dom');

var elUI = document.body.appendChild(document.createElement('div'));
var ui = getUI({
  el: elUI
});

ui.init('out');
ui.go('idle');

elUI.addEventListener('mouseover', function() {
  ui.go('over');
});

elUI.addEventListener('mouseout', function() {
  ui.go('idle');
});