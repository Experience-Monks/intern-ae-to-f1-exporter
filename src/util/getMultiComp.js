module.exports = function(json) {
	if(!json) throw new Error('A json file is required');
	if(!json.project) throw new Error('Json input is not in the correct format');

	var project = json.project;
	var comps = [];

	// find top level folder structure
	project.items.forEach(function(item) {
		
		if(item.typeName === 'Folder') {
			var foundComponent = true;
			if(item.items) {
				item.items.forEach(function(item) {
					if(item.typeName !== 'Folder') {
						foundComponent = false;
					}
				});
				if(foundComponent) {
					item.items.forEach(function(item) {
						comps.push(item);
					});	
				} 
			}
		}
	});

	return comps;
};