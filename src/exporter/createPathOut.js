var fs = require('fs');

module.exports = function createPathOut(opts) {
  if(!fs.existsSync(opts.pathOut)) {
    fs.mkdirSync(opts.pathOut);
  }
};