
var fs=require('fs');  
var path = require('path');  
var config = require('./config.json')
var _parser = require('./parser'); // it import global variable parser instead, go hell
var _yaml_parser = require('./yaml_parser');

function isVaild(fname){
  var cl =fname.split('.');
  return cl[cl.length - 1] === 'txt';
} 

function techDataMap(root){
  //root = '';
  var files = fs.readdirSync(root);
  var dataMap = {};
  for(fn in files){
    console.log(fn, files[fn], isVaild(files[fn]));
    if (isVaild(files[fn])){
      //var path = root + '\\' + files[fn];
	  var _path = path.join(root,files[fn]);
      var data = fs.readFileSync(_path, 'utf-8');
      //console.log(data);
      dataMap[files[fn]] = parser.parse(data);
    }
  }
  return dataMap;
}

function localDataMap(_path){
	console.log(_path);
	var data = fs.readFileSync(_path, 'utf-8');
	var dataMap = yaml_parser.parse(data);
	return dataMap[Object.keys(dataMap)[0]]; // yaml_parser.parse will return country key, simplify it.
}

function allDataMap(game_root){
	var localPath = path.join(game_root,'localisation',config.localFile);
	var techPath = path.join(game_root,'common','technology');
	var techMap = techDataMap(techPath);
	var localMap = localDataMap(localPath);
	return {technology : techMap,localisation:localMap};
}

function toJSONP(game_root, funcName, outputName){
  var techMap = allDataMap(game_root);
  var jsonpString = funcName+'(' + JSON.stringify(techMap) + ')';
  fs.writeFileSync(outputName, jsonpString);
}


//var data = toJSONP('./technology', 'callback');
//fs.writeFileSync('jsonpData.js', data);

//toJSONP('./technology', 'loadData', 'jsonpData.js');

toJSONP(config["stellaris-path"],'loadData','jsonpData.js');