var child_process = require('child_process');

module.exports = function getSvgFromIllustrator(src, pathOut) {
  var args = [ src, __dirname + '/illustratorSvg.jsx', pathOut ];
  args = args.map(function(item) {
    return cleanPathString(item);
  })
  var exec = `
    osascript -e 'tell application "Adobe Illustrator"
         do javascript "#include  ` + args[1] + `" with arguments {"` + args[0] + `","` + args[2] + `"}
    end tell'
  `;
  var res = child_process.execSync(exec);
  files = String.fromCharCode.apply(null, new Uint8Array(res.buffer));
  return files;
};

function cleanPathString(src) {
  return src.replace(/\\ /g, ' ');
}