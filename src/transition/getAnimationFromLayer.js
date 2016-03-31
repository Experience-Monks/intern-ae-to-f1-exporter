var getAnimationFromProperty = require('./getAnimationFromProperty');
var PROPERTIES = require('../PROPERTIES');

module.exports = function(layer, duration) {
  var rVal = null;

  Object.keys(PROPERTIES).forEach(function(propertyName) {
    var property = layer.properties.Transform[ propertyName ];
    var animation = getAnimationFromProperty(property, duration);

    if(animation) {
      rVal = rVal || {};
      rVal[ PROPERTIES[ propertyName ] ] = animation;
    }
  });

  return rVal;
};