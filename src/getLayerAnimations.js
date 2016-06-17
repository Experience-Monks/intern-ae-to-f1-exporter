var PROPERTIES = require('./PROPERTIES');

// this will parse out all properties the exporter supports
module.exports = function(layer, isStart) {
  var rVal = {
    static: {},
    animated: {}
  };
  
  Object.keys(PROPERTIES).forEach(function(propertyName) {
    var property = layer.properties.Transform[ propertyName ];

    // if a layer isn't 3d it wont have z-rotation
    if(property) {
      var keyframes = property.keyframes;

      if(keyframes.length > 1) {
        rVal.animated[ PROPERTIES[ propertyName ] ] = keyframes.map(function(keyframe) {
          return [
            keyframe[ 0 ],
            keyframe[ 1 ],
            keyframe[ 2 ].easeOutCubic.temporalEase
          ];
        });
      } else {
        rVal.static[ PROPERTIES[ propertyName ] ] = keyframes[ 0 ][ 1 ];
      }
    }
  });

  return rVal;
};