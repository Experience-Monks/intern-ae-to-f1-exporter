var merge = require('deep-extend');

function opacity(uiState, uiTarget) {
  uiState.style.opacity = uiState.opacity / 100;
  delete uiState.opacity;
}

function scale(uiState, uiTarget) {
  uiState.style.scale = uiState.scale.map(function(value) {
    return value / 100;
  });
  delete uiState.scale;
}

function rotate(uiState, uiTarget) {
  var rotation = [ -uiState.rotationX, -uiState.rotationY, uiState.rotationZ ];

  uiState.style.rotate = rotation;

  delete uiState.rotationX;
  delete uiState.rotationY;
  delete uiState.rotationZ;
}

function translate(uiState, uiTarget) {
  uiState.style.translate = uiState.position;

  // z is inverted going from ae -> dom
  uiState.style.translate[ 2 ] *= -1;

  delete uiState.position;
}

function transformOrigin(uiState, uiTarget) {
  var anchorX;
  var anchorY;

  uiState.style.transformOrigin = uiState.anchorPoint;
  anchorX = uiState.style.transformOrigin[ 0 ] /= uiTarget.width;
  anchorY = uiState.style.transformOrigin[ 1 ] /= uiTarget.height;

  uiState.style.transformOrigin.length = 2;


  // because translates in html lands are still top left corner based
  // we'll offset using margins instead kidn of yucky
  uiState.style.marginLeft = anchorX * -uiTarget.width;
  uiState.style.marginTop = anchorY * -uiTarget.height;

  delete uiState.anchorPoint;
}

var PARSERS = [
  opacity,
  scale,
  rotate,
  translate,
  transformOrigin
];

module.exports = function(dataF1) {
  var rVal = merge(
    {},
    dataF1
  );

  Object.keys(rVal.states)
  .forEach(function(nameState) {
    var state = rVal.states[ nameState ];

    Object.keys(state)
    .forEach(function(nameUI) {
      var ui = state[ nameUI ];
      var target = rVal.targets[ nameUI ];

      // drop in the style object for this ui
      ui.style = {};

      PARSERS
      .forEach(function(parser) {
        parser(ui, target);
      });
    });
  });

  return rVal;
};