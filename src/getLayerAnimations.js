var PROPERTIES = require('./PROPERTIES');

// this will parse out all properties the exporter supports
module.exports = function(layer, isStart) {
  var rVal = {
    static: {},
    animated: {}
  };
  
  Object.keys(PROPERTIES).forEach(function(propertyName) {
    var keyframes = layer.properties.Transform[ propertyName ].keyframes;

    if(keyframes.length > 1) {
      rVal.animated[ PROPERTIES[ propertyName ] ] = keyframes;
    } else {
      rVal.static[ PROPERTIES[ propertyName ] ] = keyframes[ 0 ][ 1 ];
    }
  });

  return rVal;
};