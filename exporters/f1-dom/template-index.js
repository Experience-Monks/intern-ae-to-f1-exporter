var f1Dom = require('f1-dom');
var animation = require('./animation');
var targets = require('./targets');
var aeToF1Dom = require('ae-to-f1/f1-dom/');

module.exports = function(opts) {
  opts = opts || {};
  opts.assetPath = opts.assetPath || 'assets/';
  opts.el = opts.el || document.body;

  var html = ${html};

  // add in after effects exported animation and targets
  // this will be used by getStates and getTransitions
  opts.animation = animation;
  opts.targets = targets;

  opts = Object.assign(
    {},
    {
      el: opts.el,
      states: aeToF1Dom.getStates(opts),
      transitions: aeToF1Dom.getTransitions(opts)
    },
    opts
  );

  opts.el.innerHTML = html;

  return f1Dom(opts);
};