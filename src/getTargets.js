var getCompositions = require('./util/getCompositions');
var getFirstTransitionComposition = require('./util/getFirstTransitionComposition');
var getTargetName = require('./util/getTargetName');

module.exports = function(json) {
  var rVal = null;
  var composition = getFirstTransitionComposition(json);
  var getName;

  if(composition) {
    getName = getTargetName(composition.layers);

    rVal = composition.layers
    .reduce(function(rVal, layer, i) {
      rVal[ getName(i) ] = {
        src: layer.source,
        width: layer.width,
        height: layer.height
      };

      return rVal;
    }, {});
  }

  return rVal;
};