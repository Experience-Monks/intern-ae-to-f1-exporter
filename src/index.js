var getCompositions = require('./util/getCompositions');
var getStateNamesFromComp = require('./util/getStateNamesFromComp');
var getAnimations = require('./getAnimations');
var aeTemporalToCubicEase = require('ae-temporal-to-cubic-ease');

// compositions should be named fromName_to_toName
// where fromName is the start state
// where toName is the end state
module.exports = function(json) {
  // this will add key frame ease info to the json in cubic form
  json = aeTemporalToCubicEase(json);

  var compositions = getCompositions(json);

  return compositions.map(function(comp) {
    var stateNames = getStateNamesFromComp(comp);
    var isNotBi;
    var rVal;

    // is this a transition composition
    if(stateNames) {
      isNotBi = compositions.reduce(function(isNotBi, comp) {
        var otherStateNames;

        if(!isNotBi) {
          otherStateNames = getStateNamesFromComp(comp);

          if(otherStateNames) {
            isNotBi = (stateNames.to === otherStateNames.from && stateNames.from === otherStateNames.to);
          }
        }

        return isNotBi;
      }, false);

      rVal = {
        from: stateNames.from,
        to: stateNames.to,
        bi: !isNotBi,
        duration: comp.duration,
        animation: getAnimations(comp)
      };
    }

    return rVal;
  })
  .filter(Boolean);
};