var getStateNamesFromComp = require('../util/getStateNamesFromComp');

// the purpose of this function is to return a list of compositions which
// should be bi directional animations
module.exports = function(compositions) {
  return compositions.reduce(function(biComps, composition) {
    var curName = getStateNamesFromComp(composition);
    var reverseName;

    // this is an animation
    if(curName) {
      reverseName = curName.to + '_to_' + curName.from;

      biComps[ composition.name ] = !compositions.reduce(function(isBi, composition) {
        return isBi || composition.name === reverseName;
      }, false);
    }

    return biComps;
  }, {});
};