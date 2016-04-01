var getStateNamesFromComp = require('./getStateNamesFromComp');
var getCompositions = require('./getCompositions');

// this function will return the very first composition which is defines
// a transition
module.exports = function(json) {
  var compositions = getCompositions(json);
  var composition;

  for(var i = 0; i < compositions.length; i++) {
    composition = compositions[ i ];

    if(getStateNamesFromComp(composition)) {
      break;
    }
  }

  return composition;
};