var React = require('react');
var ReactF1 = require('react-f1');
var animation = require('./animation');
var targets = require('./targets');
var aeToF1Dom = require('ae-to-f1/f1-dom/');
var InlineSVG = require('svg-inline-react');

module.exports = function(props) {
  var assetPath = props.assetPath || 'assets/';

  // add in after effects exported animation and targets
  // this will be used by getStates and getTransitions
  var aeOpts = {
    animation: animation,
    targets: targets
  };

  props = Object.assign(
    {
      states: aeToF1Dom.getStates(aeOpts),
      transitions: aeToF1Dom.getTransitions(aeOpts)
    },
    props
  );

  ${jsx};
};