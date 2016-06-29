var path = require('path');

module.exports = function(layer, i, getName) {
  var format = path.extname(layer.source).toLowerCase()
  var imageFormats = ['.jpeg', '.jpg', '.png', '.gif'];
  var videoFormats = ['.mp4', '.ogg', '.webm'];
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
  else return '';
};
