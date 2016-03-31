var merge = require('deep-extend');
var getUIFromStates = require('../getUIFromStates');

function opacity(ui) {
  ui.style.opacity = ui.opacity / 100;
  delete ui.opacity;
}

function scale(ui) {
  ui.style.scale = ui.scale.map(function(value) {
    return value / 100;
  });
  delete ui.scale;
}

function rotate(ui) {
  var rotation = [ ui.rotationX, ui.rotationY, ui.rotationZ ];

  ui.style.rotate = rotation;

  delete ui.rotationX;
  delete ui.rotationY;
  delete ui.rotationZ;
}

function translate(ui) {
  ui.style.translate = ui.position;

  delete ui.position;
}

function transformOrigin(ui) {
  ui.style.transformOrigin = ui.anchorPoint;

  delete ui.anchorPoint;
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
  var allUI = getUIFromStates(rVal.states);

  allUI.forEach(function(ui) {
    ui.style = {};

    PARSERS
    .forEach(function(parser) {
      parser(ui);
    });
  });

  return rVal;
};