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

  return html && `
  var styleContainer = Object.assign(
    props.style,
    {
      width: ${composition.width},
      height: ${composition.height},
      perspective: ${PERSPECTIVE},
      WebkitPerspective: ${PERSPECTIVE},
      MozPerspective: ${PERSPECTIVE},
      WebkitTransformStyle: 'preserve-3d',
      MozTransformStyle: 'preserve-3d',
      transformStyle: 'preserve-3d',
      WebkitTransformOrigin: '50% 50%',
      MozTransformOrigin: '50% 50%',
      transformOrigin: '50% 50%'
    }
  );

  return ( 
    <ReactF1 
      {...props}
      style={styleContainer}
    >
  ` + 
  html
  .map(function(tag) {
    return '    ' + tag + ' \n';
  })
  .join('  ') +
  `    </ReactF1>
  )`;

  function addToHTMLFromSource(layer, i) {
    html = html || [];

    switch(path.extname(layer.source).toLowerCase()) {
      case '.jpg':
      case '.png':
      case '.gif':
        html.push(
          '<img ' + 
          'data-f1=\'' + getName(i) + '\' ' +
          'src={assetPath + \'' + path.basename(layer.source) + '\'} ' + 
          'role=\'presentation\' ' + 
          'width={' + layer.width + '} ' + 
          'height={' + layer.height + '} ' + 
          'style={{position: \'absolute\', left: 0, top: 0}}' +
          ' />'
        );
        break;
      default: 
        break;
    }
  }
};
