var f1Dom = require('f1-dom');
var getStates = require('./getStates');
var getTransitions = require('./getTransitions');

module.exports = function(opts) {
  opts.assetPath = opts.assetPath || 'assets/';

  var html = ${html};

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