// this function will return the animation details for  
// this property
module.exports = function(property, duration) {
  var rVal = null;

  // see if there is some sort of animation
  if(property.keyframes.length > 1) {
    var timeLast = property.keyframes[ property.keyframes.length - 1 ][ 0 ];
    var timeStart= property.keyframes[ 0 ][ 0 ];

    rVal = {
      duration: timeLast - timeStart
    };

    // check if the keyframes doesnt start at 0 if not then we need to add in a delay
    if(timeStart !== 0) {
      rVal.delay = timeStart;
    }
  }

  return rVal;
};