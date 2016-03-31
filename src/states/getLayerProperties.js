var getValueFromProperty = require('./getValueFromProperty');

var PROPERTIES = require('../PROPERTIES');

// this will parse out all properties the exporter supports
module.exports = function(layer, isStart) {
  var rVal = {};
  
  Object.keys(PROPERTIES).forEach(function(propertyName) {
    rVal[ PROPERTIES[ propertyName ] ] = getValueFromProperty(layer.properties.Transform[ propertyName ]);
  });

  return rVal;
};