var fs = require('fs');

module.exports = function(layerData, nameTarget, svgData, animationData) {
  svgPath = svgData.replace(/~/g, process.env.HOME);
  svgPath = svgPath.replace(/\n/g, '');
  let outPath = svgPath.replace(svgPath.split('/')[svgPath.split('/').length -1], '');
  let svg = fs.readFileSync(svgPath, 'utf-8');
  let div = document.createElement('div');
  div.innerHTML = svg;
  let newSvg = document.createElement('svg');;
  newSvg = setSvgAttributes(div.children[0], newSvg);
  let nodes = div.children[0].children;
  for(var i = 0; i < nodes.length; i++) {
    let currNode = nodes[i];
    // is a layer node
    if(currNode.id !== undefined && currNode.id.length > 0 
      && nameTarget.replace(/[_][0-9]$/g, '').replace(/ /g, '_') === currNode.id) {
      let newNode = document.createElement(currNode.tagName);
      newNode.innerHTML = currNode.innerHTML;
      newNode.setAttribute('data-f1', nameTarget);
      newSvg.appendChild(newNode);
      fs.writeFileSync(outPath + currNode.id + '.svg', newSvg.outerHTML); 
    }
  }
}

function setSvgAttributes(div, newSvg, animationData) {
  Object.keys(div.attributes).forEach(function(key) {
    newSvg.setAttribute(div.attributes[key].name, div.attributes[key].value);
  });
  return newSvg;
}
