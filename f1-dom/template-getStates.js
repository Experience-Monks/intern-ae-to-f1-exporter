module.exports = function getStates(opts) {
  return getStatesFromAnimation(opts.animation, opts.targets);
};

function getStatesFromAnimation(animation, targets) {
  var states = {};

  animation.forEach(function(transition) {
    if(!states[ transition.from ]) {
      states[ transition.from ] = getState(transition.animation, targets, true);
    }

    if(!states[ transition.to ]) {
      states[ transition.to ] = getState(transition.animation, targets, false);
    }
  });

  return states;
}

function getState(transition, targets, isFrom) {
  return Object.keys(transition).reduce(function(rVal, targetName) {
    var outTarget = {};
    var targetProps = targets[ targetName ];
    var targetAnimation = transition[ targetName ];
    
    parseStatic(outTarget, targetProps, targetAnimation);
    parseAnimated(outTarget, targetProps, targetAnimation, isFrom);

    rVal[ targetName ] = outTarget;

    return rVal;
  }, {});
}

function parseStatic(out, targetProps, targetAnimation) {
  out.style = out.style || {};

  writeProperties(out.style, targetProps, targetAnimation.static);
}

function parseAnimated(out, targetProps, targetAnimation, isFrom) {
  out.style = out.style || {};

  var properties = {};

  if(isFrom) {
    Object.keys(targetAnimation.animated).forEach(function(propName) {
      properties[ propName ] = getStartValue(targetAnimation.animated[ propName ]);
    });
  } else {
    Object.keys(targetAnimation.animated).forEach(function(propName) {
      properties[ propName ] = getEndValue(targetAnimation.animated[ propName ]);
    });
  }

  writeProperties(out.style, targetProps, properties);

  function getStartValue(animation) {
    // get value of first frame
    return animation[ 0 ][ 1 ];
  }

  function getEndValue(animation) {
    // get value of last frame
    return animation[ animation.length - 1 ][ 1 ];
  }
}

function writeProperties(out, targetProps, animationProperties) {
  var properties = animationProperties;

  Object.keys(properties).forEach(function(propertyName) {
    var propertyValue = properties[ propertyName ];

    switch(propertyName) {
      case 'anchorPoint':
        writeAnchorPoint(out, targetProps, propertyValue);
      break;

      case 'opacity':
        writeOpacity(out, targetProps, propertyValue);
      break;

      case 'position': 
        writePosition(out, targetProps, propertyValue);
      break;

      case 'scale':
        writeScale(out, targetProps, propertyValue);
      break;

      case 'rotationX':
        writeRotationX(out, targetProps, propertyValue);
      break;

      case 'rotationY':
        writeRotationY(out, targetProps, propertyValue);
      break;

      case 'rotationZ':
        writeRotationZ(out, targetProps, propertyValue);
      break;
    }
  });
}

function writeAnchorPoint(out, targetProps, value) {
  out.transformOrigin = [
    value[ 0 ] / targetProps.width,
    value[ 1 ] / targetProps.height
  ];

  out.marginLeft = out.transformOrigin[ 0 ] * -targetProps.width;
  out.marginTop = out.transformOrigin[ 1 ] * -targetProps.height;
}

function writeOpacity(out, targetProps, value) {
  out.opacity = value / 100;
}

function writePosition(out, targetProps, value) {
  out.translate = value.slice();

  // z is inverted in ae
  out.translate[ 2 ] = -out.translate[ 2 ];
}

function writeScale(out, targetProps, value) {
  out.scale = value.map(function(value) {
    return value / 100;
  });
}

function writeRotationX(out, targetProps, value) {
  out.rotate = out.rotate || [0, 0, 0];

  // rotation values are inverted in ae vs browser
  out.rotate[ 0 ] = -value;
}

function writeRotationY(out, targetProps, value) {
  out.rotate = out.rotate || [0, 0, 0];

  // rotation values are inverted in ae vs browser
  out.rotate[ 1 ] = -value;
}

function writeRotationZ(out, targetProps, value) {
  out.rotate = out.rotate || [0, 0, 0];

  out.rotate[ 2 ] = value;
}