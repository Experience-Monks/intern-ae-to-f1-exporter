var getCompositions = require('./getCompositions');
var getStateNamesFromComp = require('./getStateNamesFromComp');
var getState = require('./getState');

// compositions should be named fromName_to_toName
// where fromName is the start state
// where toName is the end state
module.exports = function(json) {
  var rVal = {};
  var compositions = getCompositions(json);

  compositions.forEach(function(comp) {
    var stateNames = getStateNamesFromComp(comp);
    var fromState;
    var toState;

    if(stateNames) {
      fromState = getState(comp, true);
      toState =  getState(comp, false);

      rVal[ stateNames.from ] = fromState;
      rVal[ stateNames.to ] = toState;
    }
  });

  return rVal;
};