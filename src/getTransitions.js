var getTransitionCompositions = require('./util/getTransitionCompositions');
var getStateNamesFromComp = require('./util/getStateNamesFromComp');
var getAnimationFromComp = require('./transition/getAnimationFromComp');
var getBiTransitions = require('./transition/getBiTransitions');

module.exports = function(json) {
  var rVal = [];

  var compositions = getTransitionCompositions(json)
  var biTransitions = getBiTransitions(compositions);

  console.log(biTransitions);

  compositions
  .forEach(function(composition) {
    var transition;
    var stateNames = getStateNamesFromComp(composition);

    if(stateNames) {
      transition = {
        from: stateNames.from,
        to: stateNames.to,
        animation: getAnimationFromComp(composition),
      };

      // if this transition is bi then we add the boolean
      if(biTransitions[ composition.name ]) {
        transition.bi = true;
      }

      rVal.push(transition);
    }
  });

  return rVal;
};