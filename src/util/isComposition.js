// given an item this function will return whether the item is a Composition
module.exports = function isComposition(item) {
  return item.typeName === 'Composition';
};