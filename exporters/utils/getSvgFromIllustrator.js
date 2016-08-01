var child_process = require('child_process');
var fs = require('fs');
var os = require('os');
module.exports = function getSvgFromIllustrator(src, pathOut) {
  var args = [ src, __dirname + '/illustratorSvg.jsx', pathOut ];
  args = args.map(function(item) {
    return cleanPathString(item);
  })
  var exec;
  if(os.platform() === 'darwin') {
    exec = `
      osascript -e 'tell application "Adobe Illustrator"
           do javascript "#include  ` + args[1] + `" with arguments {"` + args[0] + `","` + args[2] + `"}
      end tell'
    `;  
    var res = child_process.execSync(exec);
    files = String.fromCharCode.apply(null, new Uint8Array(res.buffer));
  }
  else if(os.platform() === 'win32') {
    exec =  `"${__dirname + "\\"}ai.vbs"  "${args[0]}"  "${args[2]}" "${__dirname + "\\illustratorSvg.jsx"}`
    var res = child_process.execSync(exec);
    files = args[2] + '/' + args[0].split('/')[args[0].split('/').length -1].replace(/[.]ai$/g, '.svg');
  }
  else throw new Error('os not suported for execution of illustrator scripting');
  if(fs.accessSync(files) === undefined) {
    return files;  
  }
  else throw new Error('error writing svg from ai file');
};

function cleanPathString(src) {
  return src.replace(/\\ /g, ' ').replace(/~/g, process.env.HOME);
}