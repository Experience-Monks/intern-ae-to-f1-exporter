module.exports = function(composition) {
  var rVal = null;

  // compositions should be named nameFrom_to_nameTo
  var result = /(.+)_to_(.+)/.exec(composition.name);
   
  if(result) {
    rVal = {
      from: result[ 1 ],
      to: result[ 2 ]
    };
  }

  return rVal;
};