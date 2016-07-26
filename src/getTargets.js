var getCompositions = require('./util/getCompositions');
var getFirstTransitionComposition = require('./util/getFirstTransitionComposition');
var getTargetName = require('./util/getTargetName');
var fs = require('fs');

var fontPrefixes = ['.otf', '.ttf', '.ttc'];
var osxPrefixes = ['/Library/Fonts/', '/System/Library/Fonts/'];
// TODO windows system font prefixes
// var windowsPrefixes...

module.exports = function(json) {
  var rVal = null;
  var composition = getFirstTransitionComposition(json);
  var getName;

  if(composition) {
    getName = getTargetName(composition.layers);

    rVal = composition.layers
    .reduce(function(rVal, layer, i) {
      if(layer.src !== undefined) {
        rVal[ getName(i) ] = {
          src: parseSource(changeSource(layer.source)),
          width: layer.width,
          height: layer.height
        };  
      }
      else if(layer.font) {
        var fontPath;
        //get font from osx library location - TODO windows font copy
        osxPrefixes.forEach(function(pre) {
          fontPrefixes.forEach(function(f) {
            var found = fs.existsSync(pre + layer.font.font + f)
            if(found) fontPath = pre + layer.font.font + f;  
          })
        });
        if(!fontPath) throw new Error('The text layer font face could not be found on your system');
        
        layer.source = fontPath;
        rVal[ getName(i)] = {
          src: parseSource(fontPath),
          font: layer.font,
          width: layer.width,
          height: layer.height
        }
      }
      

      return rVal;
    }, {});
  }

  return rVal;
};

function changeSource(src) {
  var extension = src.split('.')[1];
  switch(extension) {
    case 'ai':
      return  src.split('.')[0] + '.svg';
    default:
      return src;
  }
}

function parseSource(src) {
  let newSrc = decodeURI(src);
  return newSrc.replace(/\ /g, '\\ ');
}