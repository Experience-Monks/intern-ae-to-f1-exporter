var getTargetName = require('./getTargetName');
var getAnimationFromLayer = require('./getAnimationFromLayer');

// the purpose of this is to parse out animation details
// from this composition
module.exports = function(composition) {
  var layers = composition.layers;
  var getLayerName = getTargetName(layers);
  var rVal = {
    duration: composition.duration
  };

  layers.forEach(function(layer, i) {
    
    var layerAnimation = getAnimationFromLayer(layer, composition.duration);

    if(layerAnimation) {
      rVal[ getLayerName(i) ] = layerAnimation;
    }
  });

  return rVal;
};