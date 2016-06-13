var React = require('react');
var ReactDom = require('react-dom');
var TestReactF1 = require('./test-react-f1');

var container = document.body.appendChild(
  document.createElement('div')
);

render('out');
render('idle');

function render(state) {
  ReactDom.render(<TestReactF1 
    go={state} 
    onMouseOver={() => {
      render('over');
    }}
    onMouseOut={() => {
      render('idle');
    }}
  />, container);  
}