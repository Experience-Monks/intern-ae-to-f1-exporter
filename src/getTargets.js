var getCompositions = require('./util/getCompositions');
var getFirstTransitionComposition = require('./util/getFirstTransitionComposition');
var getTargetName = require('./util/getTargetName');

module.exports = function(json) {
  var rVal = null;
  var composition = getFirstTransitionComposition(json);
  var getName;

  if(composition) {
    getName = getTargetName(composition.layers);

    rVal = composition.layers
    .reduce(function(rVal, layer, i) {
      rVal[ getName(i) ] = {
        src: parseSource(changeSource(layer.source)),
        width: layer.width,
        height: layer.height
      };

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