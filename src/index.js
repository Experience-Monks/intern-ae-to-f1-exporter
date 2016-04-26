var getCompositions = require('./util/getCompositions');
var getStateNamesFromComp = require('./util/getStateNamesFromComp');
var getAnimations = require('./getAnimations');

// compositions should be named fromName_to_toName
// where fromName is the start state
// where toName is the end state
module.exports = function(json) {
  var compositions = getCompositions(json);

  return compositions.map(function(comp) {
    var rVal;
    var stateNames = getStateNamesFromComp(comp);
    var bi = compositions.reduce(function(bi, comp) {
      var otherStateNames = getStateNamesFromComp(comp);
      var isBiValue = (stateNames.to === otherStateNames.from && stateNames.from === otherStateNames.to);

      if(isBiValue) {
        bi = false;
      }

      return bi;
    }, true);
    var fromState;
    var toState;

    // is this a transition composition
    if(stateNames) {
      rVal = {
        from: stateNames.from,
        to: stateNames.to,
        bi: bi,
        duration: comp.duration,
        animation: getAnimations(comp)
      };
    }

    return rVal;
  })
  .filter(Boolean);
};