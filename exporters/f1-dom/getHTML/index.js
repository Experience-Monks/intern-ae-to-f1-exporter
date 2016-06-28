var getTransitionCompositions = require('../../../src/util/getTransitionCompositions');
var getTargetName = require('../../../src/util/getTargetName');
var path = require('path');

module.exports = function(jsonAE) {
  // the following calculations were researched from
  // http://www.turbodrive.tv/blog/after-effects-to-css-3d-workflow-part-2-transposition/
  // The default camera is apparently the 50mm camera according to other documentation
  var FOCAL_LENGTH = 50;
  var FILM_WIDTH = 36;
  var VIEW_PORT_WIDTH;
  var PERSPECTIVE;

  var compositions = getTransitionCompositions(jsonAE);
  var composition = compositions[ 0 ];
  var getName;
  var html;
  
  var fileName;

  if(composition) {
    getName = getTargetName(composition.layers);

    composition.layers.forEach(function(layer, i) {
      if(layer.source) {
        addToHTMLFromSource(layer, i);  
      }
    });
  }

  VIEW_PORT_WIDTH = composition.width;

  // the following calculations were researched from
  // http://www.turbodrive.tv/blog/after-effects-to-css-3d-workflow-part-2-transposition/
  // The default camera is apparently the 50mm camera according to other documentation
  PERSPECTIVE = VIEW_PORT_WIDTH / (FILM_WIDTH/FOCAL_LENGTH);

  var styleContainer = [
    'width: ' + composition.width + 'px',
    'height: ' + composition.height + 'px',
    '-webkit-perspective: ' + PERSPECTIVE + 'px',
    '-moz-perspective: ' + PERSPECTIVE + 'px',
    'perspective: ' + PERSPECTIVE + 'px',
    '-webkit-transform-style: preserve-3d',
    '-moz-transform-style: preserve-3d',
    'transform-style: preserve-3d',
    '-webkit-transform-origin: 50% 50%',
    '-moz-transform-origin: 50% 50%',
    'transform-origin: 50% 50%'
  ];

  return html && "\n  '<div style=\"" + styleContainer.join('; ') + "\">' +\n" +
    html
    .map(function(tag) {
      return "    '" + tag + "' +\n";
    })
    .join('') +
  "  '</div>'";

  function addToHTMLFromSource(layer, i) {
    html = html || [];

    switch(path.extname(layer.source).toLowerCase()) {
      case '.jpg':
      case '.png':
      case '.gif':
        html.push(
          '<img ' + 
          'data-f1="' + getName(i) + '" ' +
          'role="presentation" ' + 
          'src="\' + opts.assetPath + \'' + path.basename(layer.source) + '" ' + 
          'width="' + layer.width + '" ' + 
          'height="' + layer.height + '" ' + 
          'style="position: absolute; left: 0px; top: 0px;" ' +
          ' />'
        );
      break;
    }
  }
};
