var getTransitionCompositions = require('../../../src/util/getTransitionCompositions');
var getTargetName = require('../../../src/util/getTargetName');
var addToHTMLFromSource = require('../../utils/addToHTMLFromSource');

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
        addToHTMLFromSource(layer, i, html, getName);  
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
};
