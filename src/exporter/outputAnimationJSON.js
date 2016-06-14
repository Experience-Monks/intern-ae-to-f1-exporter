var fs = require('fs');
var path = require('path');
var createPathOut = require('./createPathOut');

module.exports = function outputAnimationJSON(opts, json, animationData) {
  createPathOut(opts);

  // output animation data
  fs.writeFileSync(path.join(opts.pathOut, 'animation.json'), JSON.stringify(animationData, null, '  '));
};