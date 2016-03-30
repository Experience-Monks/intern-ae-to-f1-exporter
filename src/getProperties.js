var getPropertyOpacity = require('./getPropertyOpacity');
var getPropertyPosition = require('./getPropertyPosition');

// this will parse out all properties the exporter supports
module.exports = function(layer, isStart) {
  return {
    position: getPropertyPosition(layer, isStart), 
    opacity: getPropertyOpacity(layer, isStart)
  };
};