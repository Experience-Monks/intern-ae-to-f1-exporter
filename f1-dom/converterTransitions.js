var merge = require('deep-extend');

module.exports = function(dataF1) {
  var states = dataF1.states;
  var rVal = dataF1.transitions.map(function(transition) {
    var nameFrom = transition.from;
    var nameTo = transition.to;
    var stateFrom = states[ nameFrom ];
    var stateTo = states[ nameTo ];
    var animation = transition.animation;
    var bi = transition.bi;
    var  rVal = {
      from: nameFrom,
      to: nameTo
    };

    if(bi) {
      rVal.bi = bi;
    }

    if(animation) {
      // now figure out keyframes  
      rVal.animation = {
        duration: animation.duration,
        keyframes: convertKeyFrames(animation.keyframes, stateFrom, stateTo)
      };
    }
    
    return rVal;
  });

  return rVal;
};


function convertKeyFrames(keyframes, stateFrom, stateTo) {
  return Object.keys(keyframes)
  .reduce(function(rVal, nameUI) {
    var rValUI = rVal[ nameUI ] = {};
    var ui = keyframes[ nameUI ];

    // add in style
    rValUI.style = {};

    Object.keys(ui)
    .forEach(function(propName) {
      
    });

    return rVal;
  }, {});
}