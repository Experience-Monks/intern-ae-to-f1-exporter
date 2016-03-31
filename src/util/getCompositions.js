var isComposition = require('./isComposition');

// this will return all compositions from the json
module.exports = function(json) {
  var items = json.project.items;

  // loop through all footage compositions etc
  return items.filter(isComposition);
};