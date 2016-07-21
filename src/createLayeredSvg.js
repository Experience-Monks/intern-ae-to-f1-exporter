var fs = require('fs');

module.exports = function(layerData, nameTarget, svgData, animationData) {
  svgPath = svgData.replace(/~/g, process.env.HOME);
  svgPath = svgPath.replace(/\n/g, '');
  let outPath = svgPath.replace(svgPath.split('/')[svgPath.split('/').length -1], '');
  let svg = fs.readFileSync(svgPath, 'utf-8');
  let div = document.createElement('div');
  let newSvg;
  div.innerHTML = svg;
  document.body.appendChild(div);
  let nodes = div.children[0].children;
  for(var i = 0; i < nodes.length; i++) {
    let currNode = nodes[i];
    // is a layer node
    if(currNode.id !== undefined && currNode.id.length > 0) {
      let bounds = currNode.getBBox();
      newSvg = document.createElement('svg');
      newSvg = setSvgAttributes(div.children[0], newSvg, bounds);
      newSvg.appendChild(currNode);
      fs.writeFileSync(outPath + currNode.id + '.svg', newSvg.outerHTML); 
    }
  }
  document.body.removeChild(div);
}

function setSvgAttributes(div, newSvg, bounds) {
  Object.keys(div.attributes).forEach(function(key) {
    newSvg.setAttribute(div.attributes[key].name, div.attributes[key].value);
  });
  newSvg.removeAttribute('viewbox');
  newSvg.removeAttribute('style');
  return newSvg;
}

// function parseLayerObjects(layerData, ) {}