var getValueFromProperty = require('./getValueFromProperty');

var PROPERTIES = require('../PROPERTIES');

// this will parse out all properties the exporter supports
module.exports = function(layer, isStart) {
  var rVal = {};
  
  Object.keys(PROPERTIES).forEach(function(propertyName) {
    var property = 
    rVal[ PROPERTIES[ propertyName ] ] = 
    getValueFromProperty(layer.properties.Transform[ propertyName ], isStart);

    // add in special handling for Anchor Point
    // most systems work off a percentage so lets convert it here
    if(propertyName === 'Anchor Point') {
      property[ 0 ] /= layer.width;
      property[ 1 ] /= layer.height;
    }
  });

  return rVal;
};