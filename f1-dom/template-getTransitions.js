var keyframes = require('keyframes');
var merge = require('deep-extend');
var bezierEasing = require('bezier-easing');

module.exports = function getTransitions(opts) {
  return opts.animation
  .map(function(transition) {
    if(!transition.bi) {
      return [{
        from: transition.from,
        to: transition.to,
        animation: getAnimation(transition, opts.targets, false)
      }];
    } else {
      return [
        {
          from: transition.from,
          to: transition.to,
          animation: getAnimation(transition, opts.targets, false)
        },
        {
          from: transition.to,
          to: transition.from,
          animation: getAnimation(transition, opts.targets, true)
        }
      ];
    }
  })
  .reduce(function(rVal, transitions) {
    return rVal.concat(transitions);
  }, []);
};

function getAnimation(transition, uiTargets, isReversed) {
  var targets = transition.animation;
  var calculateValue = function(start, end, t) {
    var startKeyValue = start.value[ 1 ];
    var endKeyValue = end.value[ 1 ];
    var ease = start.value[ 2 ];

    // since this is a hold frame we'll just return it
    if(ease === 'hold') {
      return startValue;
    // this is a bezier ease
    } else if(Array.isArray(ease)) {
      ease = bezierEasing.apply(undefined, ease);

      if(Array.isArray(startKeyValue)) {
        return endKeyValue.map(function(endValue, i) {
          var startValue = startKeyValue[ i ];

          return (endValue - startValue) * ease(t) + startValue;  
        });
      } else {
        return (endKeyValue - startKeyValue) * ease(t) + startKeyValue;
      }

    // this is just a lerp
    } else {
      if(Array.isArray(startKeyValue)) {
        return endKeyValue.map(function(endValue, i) {
          var startValue = startKeyValue[ i ];

          return (endValue - startValue) * t + startValue;  
        });
      } else {
        return (endKeyValue - startKeyValue) * t + startKeyValue;
      }
    }
  };
  var animators = Object.keys(targets).reduce(function(keyframers, targetName) {
    var target = targets[ targetName ];
    var uiTarget = uiTargets[ targetName ]; // ui target contains the src and width and height

    var propKeyframers = Object.keys(target.animated).map(function(propName) {
      var frames = target.animated[ propName ];
      var animator = keyframes();
      var propWriter;

      frames.forEach(function(frame) {
        animator.add({ time: frame[ 0 ], value: frame });
      });

      switch(propName) {
        case 'anchorPoint':
          propWriter = writeAnchorPoint;
        break;

        case 'opacity':
          propWriter = writeOpacity;
        break;

        case 'position': 
          propWriter = writePosition;
        break;

        case 'scale':
          propWriter = writeScale;
        break;

        case 'rotationX':
          propWriter = writeRotationX;
        break;

        case 'rotationY':
          propWriter = writeRotationY;
        break;

        case 'rotationZ':
          propWriter = writeRotationY;
        break;
      }


      return function(time, ui) {
        propWriter(
          ui[ targetName ].style, 
          uiTarget, 
          animator.value(time, calculateValue)
        );
      };      
    });

    return keyframers.concat(propKeyframers);
  }, []);


  var animator = function(time, start) {
    var ui = merge(
      {},
      start
    );

    if(isReversed) {
      time = transition.duration - time;
    }

    animators.forEach(function(animator) {
      animator(time, ui);
    });

    return ui;
  };

  animator.duration = transition.duration;

  return animator;
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