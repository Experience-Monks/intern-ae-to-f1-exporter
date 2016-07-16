var path = require('path');
var fs = require('fs');
var child_process = require('child_process');

module.exports = function(layer, i, getName, opts) {
  var format = path.extname(layer.source).toLowerCase()
  var pathOut = opts.pathOut;
  var imageFormats = ['.jpeg', '.jpg', '.png', '.gif'];
  var videoFormats = ['.mp4', '.ogg', '.webm'];
  var illustratorFormats = ['.ai'];
  if(imageFormats.indexOf(format) !== -1) {
    return '<img ' + 
      'data-f1=\'' + getName(i) + '\' ' +
      'src={assetPath + \'' + path.basename(layer.source) + '\'} ' + 
      'role=\'presentation\' ' + 
      'width={' + layer.width + '} ' + 
      'height={' + layer.height + '} ' + 
      'style={{position: \'absolute\', left: 0, top: 0}}' +
      ' />';
  }
  else if (videoFormats.indexOf(format) !== -1) {
    return '<video ' + 
      'src={assetPath + \'' + path.basename(layer.source) + '\'} ' + 
      'width={' + layer.width + '} ' + 
      'height={' + layer.height + '} ' + 
      'style={{position: \'absolute\', left: 0, top: 0}} >' +
      '</video>';
  }
  else if (illustratorFormats.indexOf(format) !== -1) {
    var resp = getSvgFromIllustrator(layer.source, pathOut);
    if(!resp) throw new Error(err);
    var svgFile = (pathOut + path.basename(resp)).replace(/\n/g, '');
    var fileContents = fs.readFileSync(svgFile, {encoding: 'utf-8'});
    return '<svg version=' + fileContents.split('<svg version=')[1];
  }
  else return '';
};

function getSvgFromIllustrator(src, pathOut) {
  var args = [ src, __dirname + '/illustratorSvg.jsx', pathOut ];
  var exec = `
    osascript -e 'tell application "Adobe Illustrator"
         do javascript "#include  ` + args[1] + `" with arguments {"` + args[0] + `","` + args[2] + `"}
    end tell'
  `;
  var res = child_process.execSync(exec);
  files = String.fromCharCode.apply(null, new Uint8Array(res.buffer));
  return files;
}
 