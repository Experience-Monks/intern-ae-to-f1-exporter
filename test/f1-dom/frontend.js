var getUI = require('./test-f1-dom');

var elUI = document.body.appendChild(document.createElement('div'));
elUI.style.width = '400px';
elUI.style.height = '640px';
elUI.style.overflow = 'hidden';

var ui = getUI({
  el: elUI
});

ui.init('out');
ui.go('idle');

window.addEventListener('mousedown', function() {
  console.log('----- over');
  ui.go('over');
});

window.addEventListener('mouseup', function() {
  console.log('---- idle');
  ui.go('idle');
});