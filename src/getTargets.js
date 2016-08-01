var getCompositions = require('./util/getCompositions');
var getFirstTransitionComposition = require('./util/getFirstTransitionComposition');
var getTargetName = require('./util/getTargetName');
var fs = require('fs');
var os = require('os');

var fontPrefixes = ['.otf', '.ttf', '.ttc', '.dfont'];
var osxPrefixes = ['/Library/Fonts/', '/System/Library/Fonts/'];
var windowsPrefixes = [process.env.windir + '\\fonts']

module.exports = function(json) {
  var rVal = null;
  var composition = getFirstTransitionComposition(json);
  var getName;

  if(composition) {
    getName = getTargetName(composition.layers);

    rVal = composition.layers
    .reduce(function(rVal, layer, i) {
      if(layer.source !== undefined) {
        layer.anchor = getAnchorFromLayer(layer)
        rVal[ getName(i) ] = {
          src: parseSource(changeSource(layer.source)),
          width: layer.width,
          height: layer.height,
          anchor: layer.anchor
        };  
      }
      else if(Object.keys(layer.font).length > 0) {
        var fontPath;
        //get font from osx library location - TODO windows font copy
        if(os.platform() === 'darwin') {
          osxPrefixes.forEach(function(pre) {
            fontPrefixes.forEach(function(f) {
              var found = fs.existsSync(pre + layer.font.font + f)
              if(found) fontPath = pre + layer.font.font + f;  
            })
          });  
        }
        if(os.platform() === 'win32') {
          windowsPrefixes.forEach(function(pre) {
            fontPrefixes.forEach(function(f) {
              var found = fs.existsSync(pre + '\\' + layer.font.font + f)
              if(found) fontPath = pre + '\\' + layer.font.font + f;  
            })
          });
        }
        if(!fontPath) throw new Error('The text layer font face could not be found on your system');
        
        layer.source = fontPath;
        layer.anchor = getAnchorFromLayer(layer)
        rVal[ getName(i)] = {
          src: parseSource(fontPath),
          font: layer.font,
          width: layer.width,
          height: layer.height,
          anchor: layer.anchor
        }
      }
      

      return rVal;
    }, {});
  }

  return rVal;
};

function getAnchorFromLayer(layer) {
  return layer.properties.Transform['Anchor Point'].keyframes[0][1];
}

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