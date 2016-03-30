var getTargetName = require('./getTargetName');
var getLayerProperties = require('./getLayerProperties');

// the purpose of this function is to read states from the
// composition
// 
// if isStart is true then the state values will be read from
// the start keyframes otherwise its read from the end keyframes
module.exports = function(composition, isStart) {
  var rVal = {};
  var getNameFromLayer = getTargetName(composition.layers);

  composition.layers.forEach(function(layer, i) {
    var targetName = getNameFromLayer(i);

    rVal[ targetName ] = getLayerProperties(layer, isStart);

    if(!rVal[ targetName ]) {
      throw new Error('couldn\'t parse out the ' + (isStart ? 'from' : 'to') + ' state from ' + composition.name + ' for target ' + targetName);
    }
  });

  return rVal;
};