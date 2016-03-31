var getCompositions = require('./util/getCompositions');
var getStateNamesFromComp = require('./util/getStateNamesFromComp');
var getAnimationFromComp = require('./transition/getAnimationFromComp');

module.exports = function(json) {
  var rVal = [];

  getCompositions(json)
  .forEach(function(composition) {
    var transition;
    var stateNames = getStateNamesFromComp(composition);

    if(stateNames) {
      transition = {
        from: stateNames.from,
        to: stateNames.to,
        animation: getAnimationFromComp(composition)
      };

      rVal.push(transition);
    }
  });

  return rVal;
};