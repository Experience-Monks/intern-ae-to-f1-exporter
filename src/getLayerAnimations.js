var PROPERTIES = require('./PROPERTIES');

// this will parse out all properties the exporter supports
module.exports = function(layer, isStart) {
  var rVal = {
    static: {},
    animated: {}
  };
  
  Object.keys(PROPERTIES).forEach(function(propertyName) {
    var property = layer.properties.Transform[ propertyName ];

    // if a layer isn't 3d it wont have z-rotation
    if(property) {
      var keyframes = property.keyframes;

      if(keyframes.length > 1) {
        rVal.animated[ PROPERTIES[ propertyName ] ] = getKeyFrames(property);
      } else {
        rVal.static[ PROPERTIES[ propertyName ] ] = keyframes[ 0 ][ 1 ];
      }
    }
  });

  return rVal;
};





function getKeyFrames(property) {
  var keyframes = property.keyframes;

  return keyframes.map(function(keyframe, i) {
    var out;
    var nextFrame = keyframes[ i + 1 ];
    var timeCurrent = keyframe[ 0 ];
    var valueCurrent = keyframe[ 1 ];
    var easeCurrent = keyframe[ 2 ];
    var averageSpeed = 0;
    var bezierOut = {};
    var bezierIn = {};
    var isEaseLinear;
    var influenceIn;
    var influenceOut;
    var timeNext;
    var valueNext;
    var easeNext;
    var durationCurrentToNext;
    var curveLength;

    // this isn't the last keyframe or the current keyframe is not a hold
    if(nextFrame && easeCurrent.easeOut.type !== 'hold') {

      timeNext = nextFrame[ 0 ];
      valueNext = nextFrame[ 1 ];
      easeNext = nextFrame[ 2 ];
      durationCurrentToNext = timeNext - timeCurrent;

      isEaseLinear = easeNext && (easeCurrent.easeOut.type === 'linear' && easeCurrent.easeOut.type === easeNext.easeIn.type);

      // we have an ease and theres a spatialTangent defined
      // some properties don't have spatial tangents (most props)
      switch(property.propertyValueType) {
        case 'ThreeD_SPATIAL':
        case 'TwoD_SPATIAL':
          curveLength = getCurveLength(
            valueCurrent, 
            valueNext,
            easeCurrent.easeOut.spatialTangent, 
            easeNext.easeIn.spatialTangent
          );

          if(curveLength === 0) {
            influenceOut = easeCurrent.easeOut;
            influenceIn = easeNext.easeIn;
          } else {
            influenceOut = Math.min(100 * curveLength / (easeCurrent.easeOut.temporalEase[ 0 ].speed * durationCurrentToNext), easeCurrent.easeOut.temporalEase[ 0 ].influence);
            influenceIn = Math.min(100 * curveLength / (easeCurrent.easeIn.temporalEase[ 0 ].speed * durationCurrentToNext), easeCurrent.easeIn.temporalEase[ 0 ].influence);
          }

          averageSpeed = curveLength / durationCurrentToNext;

          bezierOut.x = influenceOut / 100;
          bezierIn.x = 1 - influenceIn / 100;
        break;

        case 'SHAPE':
          averageSpeed = 1;
          influenceIn = Math.min(100 / easeCurrent.easeIn.temporalEase[ 0 ].speed, easeCurrent.easeIn.temporalEase[ 0 ].influence);
          influenceOut = Math.min(100 / easeCurrent.easeOut.temporalEase[ 0 ].speed, easeCurrent.easeOut.temporalEase[ 0 ].influence);

          bezierOut.x = infOut / 100;
          bezierIn.x = 1 - infIn / 100;
        break;

        case 'ThreeD':
        case 'TwoD':
        case 'OneD':
        case 'COLOR':
          bezierOut.x = [];
          bezierIn.x = [];
          averageSpeed = [];

          // calculate bezier
          easeNext.easeIn.temporalEase.forEach(function(easeIn, i) {
            var easeOut = easeCurrent.easeOut.temporalEase[ i ];

            bezierOut.x[ i ] = easeOut.influence / 100;
            bezierIn.x[ i ] = 1 - easeIn.influence / 100;
          });

          // now calculate average speed
          getArrayValue(valueCurrent).forEach(function(valueCurrent, i) {
            averageSpeed[ i ] = (getArrayValue(valueNext)[ i ] - valueCurrent) / durationCurrentToNext;
          });
        break;
      }

      // now calculate the bezier.y
      if(averageSpeed === 0) {
        bezierOut.y = bezierOut.x;
        bezierIn.y = bezierIn.x;
      } else {
        switch(property.propertyValueType) {
          case 'ThreeD_SPATIAL':
          case 'TwoD_SPATIAL':
            // check if this animation is just linear
            if(isEaseLinear) {
              bezierOut.y = bezierOut.x;
              bezierIn.y = bezierIn.x;
            } else {
              bezierOut.y = ((easeCurrent.easeOut.temporalEase[ 0 ].speed) / averageSpeed) * bezierOut.x;
              bezierIn.y =  1 - ((easeNext.easeIn.temporalEase[ 0 ].speed) / averageSpeed) * (influenceIn / 100);
            }
          break;

          case 'ThreeD':
          case 'TwoD':
          case 'OneD':
          case 'COLOR':
            bezierOut.y = [];
            bezierIn.y = [];

            easeNext.easeIn.temporalEase.forEach(function(easeIn, i) {
              easeOut = easeCurrent.easeOut.temporalEase[ i ];

              if(isEaseLinear || averageSpeed[ i ] === 0) {
                bezierOut.y[ i ] = bezierOut.x[ i ];
                bezierIn.y[ i ] = bezierIn.x[ i ];
              } else {
                bezierOut.y[ i ] = (easeOut.speed / averageSpeed[ i ]) * bezierOut.x [ i ];
                bezierIn.y[ i ] = 1 - (easeIn.speed / averageSpeed[ i ]) * (easeIn.influence / 100);
              }
            });
          break;
        }
      }

      out = [
        timeCurrent,
        valueCurrent,
        [ 
          resolveToNonArrayIfPossible(bezierIn.x), 
          resolveToNonArrayIfPossible(bezierIn.y), 
          resolveToNonArrayIfPossible(bezierOut.x), 
          resolveToNonArrayIfPossible(bezierOut.y) 
        ]
      ];
    // this is the last keyframe
    } else {
      out = [
        timeCurrent,
        valueCurrent
      ];

      if(easeCurrent.easeOut === 'hold') {
        out.push('hold');
      }
    }

    return out;
  });
}

function getCurveLength(valueStart, valueEnd, bezierOut, bezierIn) {
  // this is just to normalize it so that all values are always
  // of type array
  valueStart = getArrayValue(valueStart);
  valueEnd = getArrayValue(valueEnd);
  bezierOut = getArrayValue(bezierOut);
  bezierIn = getArrayValue(bezierIn);

  var totalLength = 0;

  var controlPoint1;
  var controlPoint2;

  var triCoord1;
  var triCoord2;
  var triCoord3;
  var liCoord1;
  var liCoord2;

  var point;
  var pointPrev;
  var pointDistance;
  var t;

  for(var i = 0; i < 2; i++) {
    point = [];
    controlPoint1 = [];
    controlPoint2 = [];
    t = i / 1;
    pointDistance = 0;

    for(var j = 0; j < bezierOut.length; j++) {
      if(controlPoint1[ j ] === undefined) {
        controlPoint1[ j ] = valueStart[ j ] + bezierOut[ j ];
        controlPoint2[ j ] = valueEnd[ j ] + bezierIn[ j ];
      }

      triCoord1 = valueStart[ j ] + (controlPoint1[ j ] - valueStart[ j ]) * t;
      triCoord2 = controlPoint1[ j ] + (controlPoint2[ j ] - controlPoint1[ j ]) * t;
      triCoord3 = controlPoint2[ j ] + (valueEnd[ j ] - controlPoint2[ j ]) * t;
      liCoord1 = triCoord1 + (triCoord2 - triCoord1) * t;
      liCoord2 = triCoord2 + (triCoord3 - triCoord2) * t;

      point.push(liCoord1 + (liCoord2 - liCoord1) * t);

      if(pointPrev) {
        pointDistance += Math.pow(point[ j ] - pointPrev[ j ], 2);
      }
    }

    totalLength += Math.sqrt(pointDistance);
    pointPrev = point;
  }

  return totalLength;
}

function getArrayValue(value) {
  return Array.isArray(value) ? value : [ value ];
}

function resolveToNonArrayIfPossible(value) {
  return Array.isArray(value) && value.length === 1 ? value[ 0 ] : value;
}