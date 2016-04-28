var f1Dom = require('f1-dom');
var animation = require('./animation');
var targets = require('./targets');
var getStates = require('./getStates');
var getTransitions = require('./getTransitions');

module.exports = function(opts) {
  opts.assetPath = opts.assetPath || 'assets/';

  var html = ${html};

  // add in after effects exported animation and targets
  // this will be used by getStates and getTransitions
  opts.animation = animation;
  opts.targets = targets;

  opts = Object.assign(
    {},
    {
      el: document.body,
      states: getStates(opts),
      transitions: getTransitions(opts)
    },
    opts
  );

  opts.el.innerHTML = html;

  return f1Dom(opts);
};