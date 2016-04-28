module.exports = function getTransitions(opts) {
  return opts.animation.map(function(transition) {

    return {
      from: transition.from,
      to: transition.to,
      bi: transition.bi,
      animation: {
        duration: transition.duration * 10
      }
    };
  });
};