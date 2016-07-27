var path = require('path');
var fs = require('fs');
var removeAttributes = require('remove-attributes');
var getSvgFromIllustrator = require('./getSvgFromIllustrator');
var imageFormats = ['.jpeg', '.jpg', '.png', '.gif'];
var videoFormats = ['.mp4', '.ogg', '.webm'];
var illustratorFormats = ['.ai'];
var textFormats = ['.otf', '.ttf', '.ttc'];
var fontStyles = {
  justification : 'justification', 
  font: 'font-face', 
  fontSize: 'font-size', 
  fillColor: 'fill-color'
};

module.exports = function(layer, i, getName, opts) {
  var format = path.extname(layer.source).toLowerCase();
  var pathOut = opts.pathOut;
  if(imageFormats.indexOf(format) !== -1) {
    return '<img ' + 
      'data-f1=\'' + getName(i) + '\' ' +
      'src={assetPath + \'' + path.basename(layer.source) + '\'} ' + 
      'role=\'presentation\' ' + 
      'width={' + layer.width + '} ' + 
      'height={' + layer.height + '} ' + 
      'style={{position: \'absolute\', left: 0, top: 0}}' +
      ' />';
  }
  else if (videoFormats.indexOf(format) !== -1) {
    return '<video ' + 
      'src={assetPath + \'' + path.basename(layer.source) + '\'} ' + 
      'width={' + layer.width + '} ' + 
      'height={' + layer.height + '} ' + 
      'style={{position: \'absolute\', left: 0, top: 0}} >' +
      '</video>';
  }
  else if (illustratorFormats.indexOf(format) !== -1) {
    var resp = getSvgFromIllustrator(layer.source, pathOut);
    if(!resp) throw new Error(err);
    var svgFile = (pathOut + path.basename(resp)).replace(/\n/g, '');
    var fileContents = fs.readFileSync(svgFile, {encoding: 'utf-8'});

    var svg = '<svg version=' + fileContents.split('<svg version=')[1];
    svg = svg.replace('/xlink:/g', '');
    svg = removeAttributes(svg, 
      ['xmlns', 
        'xmlns:xlink',
        'xml:space',
        'xlink'
      ]);
    if(opts.react) {
      var reactSvg = svg.replace(/\n/g, '');
      return `<InlineSVG 
        src={\`${reactSvg}\`}
      />`
    }
    else return svg.replace(/\n/g, '');
  }
  else if (textFormats.indexOf(format) !== -1) {
    var styleContents = 
      opts.react ? formatTextContentsReact(layer.font) : formatTextContents(layer.font);
    return opts.react? `
      <p 
        style={{ ${styleContents} }}
      >
        ${'{\'' + layer.font.text + '\'}'} 
      </p>
    ` :
    `<p ${styleContents} >${layer.font.text}</p>`;
  }
  else return '';
};
 
function formatTextContents(font) {
  var colorString = `rgb( ${font.fillColor[0] * 256}, ${font.fillColor[1] * 256} , ${font.fillColor[2] * 256} )`;
  var styleString = `style="font-face: ${font.font}; font-size: ${font.fontSize}; color:${colorString};"`
  .replace(/\n/g, '');
  return styleString;
}
function formatTextContentsReact(font) {
  console.log(font);
  return `
    fontFace: '${font.font}',
    fontSize: '${font.fontSize}',
    color: 'rgb( ${font.fillColor[0] * 256}, ${font.fillColor[1] * 256} , ${font.fillColor[2] * 256} )'
  `;
}
