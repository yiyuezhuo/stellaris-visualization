
var fs=require('fs');  
var path = require('path');  
var _parser = require('./parser'); // it import global variable parser instead, go hell

function isVaild(fname){
  var cl =fname.split('.');
  return cl[cl.length - 1] === 'txt';
} 

function allDataMap(root){
  //root = '';
  var files = fs.readdirSync(root);
  var dataMap = {};
  for(fn in files){
    console.log(fn, files[fn], isVaild(files[fn]));
    if (isVaild(files[fn])){
      var path = root + '\\' + files[fn];
      var data = fs.readFileSync(path, 'utf-8');
      //console.log(data);
      dataMap[files[fn]] = parser.parse(data);
    }
  }
  return dataMap;
}

function toJSONP(root, funcName, outputName){
  var dataMap = allDataMap(root);
  var jsonpString = funcName+'(' + JSON.stringify(dataMap) + ')';
  fs.writeFileSync(outputName, jsonpString);
}


//var data = toJSONP('./technology', 'callback');
//fs.writeFileSync('jsonpData.js', data);

toJSONP('./technology', 'loadData', 'jsonpData.js');