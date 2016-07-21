module.exports = function(layers) {
  // make sure a number isn't being passed
  if(!Array.isArray(layers)) {
    throw new Error('pass in a layers Array to this function first which will return a function indices for a layer can be passed to');
  }

  // we need to get if there are layers with the same name since After Effects allows for that
  var duplicates = layers.reduce(function(duplicates, layer, i) {
    var otherLayer;
    // identify the layer name for svgs for example
    layer.layerName = layer.name.replace(/ /g, '_');
    layers.forEach(function(otherLayer, j) {
      if(i !== j && layer.name === otherLayer.name) {
        if(!duplicates) {
          duplicates = {};
        }

        if(duplicates[ layer.name ] === undefined) {
          duplicates[ layer.name ] = [ i ];
        }

        duplicates[ layer.name ].push(j);
      }
    });

    return duplicates;
  }, null);

  return function getTargetName(idx) {
    var layer = layers[ idx ];
    var layerName;

    if(typeof idx !== 'number') {
      throw new Error('pass in an index that points to a layer');
    }

    if(duplicates) {
      if(duplicates[ layer.name ]) {
        layerName = layer.name + '_' + duplicates[ layer.name ].indexOf(idx);
      } else {
        layerName = layer.name;
      }
    } else {
      layerName = layer.name;
    }

    // we want to remove '.' out of the name because later on targets are resolved with . in the name
    layerName = layerName.split('.').join(' ');

    return layerName;
  };
};