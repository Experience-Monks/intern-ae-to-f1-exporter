// the purpose of this function is to get the value of property
// from keyframes
module.exports = function(property, isStart) {
  var rVal;
  var keyframes = property.keyframes;

  if(keyframes.length > 1) {
    if(isStart) {
      rVal = keyframes[ 0 ][ 1 ];  
    } else {
      rVal = keyframes[ keyframes.length - 1 ][ 1 ];
    }
  } else {
    rVal = keyframes[ 0 ][ 1 ];
  }

  return rVal;
};