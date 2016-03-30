var getValueFromProperty = require('./getValueFromProperty');

module.exports = function(layer, isStart) {
  return getValueFromProperty(layer.properties.Transform.Position, isStart);
};