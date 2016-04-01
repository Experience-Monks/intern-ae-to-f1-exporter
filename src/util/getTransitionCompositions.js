var getCompositions = require('./getCompositions');
var getStateNamesFromComp = require('./getStateNamesFromComp');

// the purpose of this function is to return and array of
// of compositions which are transition animations. 
// In after effects projects there maybe compositions which are not for f1
module.exports = function(json) {
  return getCompositions(json)
  .filter(getStateNamesFromComp);
};