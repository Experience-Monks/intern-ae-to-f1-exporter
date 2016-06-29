var path = require('path');

module.exports = function(layer, i, html) {
  html = html || [];
  switch(path.extname(layer.source).toLowerCase()) {
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
      html.push(
        '<img ' + 
        'data-f1=\'' + getName(i) + '\' ' +
        'src={assetPath + \'' + path.basename(layer.source) + '\'} ' + 
        'role=\'presentation\' ' + 
        'width={' + layer.width + '} ' + 
        'height={' + layer.height + '} ' + 
        'style={{position: \'absolute\', left: 0, top: 0}}' +
        ' />'
      );
      break;
    case '.mp4':
    case '.ogg':
    case '.webm':
      html.push('<video ' + 
      'src={assetPath + \'' + path.basename(layer.source) + '\'} ' + 
      'width={' + layer.width + '} ' + 
      'height={' + layer.height + '} ' + 
      'style={{position: \'absolute\', left: 0, top: 0}} >' +
      '</video>');
      break;
    case '.svg':
      break;
    default: 
      break;
  }
};
