var getStates = require('./getStates');
var getTransitions = require('./getTransitions');
var getTargets = require('./getTargets');

module.exports = function(json) {
  return {
    states: getStates(json),
    transitions: getTransitions(json),
    targets: getTargets(json)
  };
};