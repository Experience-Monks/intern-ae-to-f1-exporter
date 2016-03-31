module.exports = function(states) {

  // convert states to an array of states
  var arrStates = Object.keys(states)
  .map(function(nameState) {
    return states[ nameState ];
  })
  .map(function(state) {
    return state;
  });

  // convert array states to ui
  return arrStates
  .map(function(state) {
    return Object.keys(state)
    .map(function(nameUI) {
      return state[ nameUI ];
    });
  })
  .reduce(function(arrUI, stateUI) {
    return arrUI.concat(stateUI);
  }, []);
};