module.exports = function(a) {
  let temp = {};
  for(let i = 0; i < a.length; i++) {
      temp[a[i]] = true;
  }
  return Object.keys(temp);
};
