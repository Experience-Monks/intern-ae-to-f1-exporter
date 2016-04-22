// this function will return the animation details for  
// this property
module.exports = function(property, duration) {
  var rVal = null;

  // see if there is some sort of animation
  if(property.keyframes.length > 1) {
    var firstFrame = property.keyframes[ 0 ];

    rVal = property.keyframes.map(function(timeValueEase) {
      var timeValue = timeValueEase.slice(0, 2);

      // convert time to be a scale
      timeValue[ 0 ] /= duration;

      return timeValue;
    });
  }

  return rVal;
};