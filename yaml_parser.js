yaml_parser = (function(){
	// Paradox like unstandard yaml file? right ...
	
	function parse(doc){
		
		var sl = doc.split('\n');
		var objName = sl[0].split(':')[0];
		
		var objMap = {}
		
		sl.slice(1).forEach(function(line){
			line = line.trim();
			index = line.indexOf("#");
			if(index!=-1){
				line = line.slice(0,index);
			}
			var index = line.indexOf(":");
			if(index==-1){
				return;//continue;
			}
			var key = line.slice(0,index);
			var value = line.slice(index+1);
			index = value.indexOf(" ");
			var num = Number(value.slice(0,index));
			var content = value.slice(index+1);
			content = content.slice(1,content.length-1); // remove quote
			
			objMap[key] = [num,content];
			
		});
		
		var res = {};
		res[objName] = objMap;
		return res
	}
	
	return {parse : parse};
	
	
	
}());