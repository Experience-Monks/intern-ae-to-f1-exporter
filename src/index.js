var getStates = require('./getStates');
var getTransitions = require('./getTransitions');

module.exports = function(json) {
  return {
    states: getStates(json),
    transitions: getTransitions(json)
  };
};