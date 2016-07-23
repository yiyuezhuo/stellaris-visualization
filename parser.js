//console.log(data.split('\n')[0]);

parser = (function(){
  var spaceChar = ' ';
  var quoteChar = '"';
  var commentChar = '#';
  
  var nifixList = ['=','<','>','<=','>='];

  var mode = {
    ready : 0,
    section : 1,
    quote : 2
  }

  function cutLine(line){
    var wordList = [],
        state = mode.ready,
        word = [],
        i;
    //line = line + ' '; // similation \n removed by gloabal split
    line = line.replace(/\r/g,' ');
    line = line.replace(/\t/g,' ');
    line = line + ' ';
    for(i = 0; i < line.length; i++){
      if(state === mode.ready){
        if(line[i] === spaceChar){
          state = mode.ready;
        }
        else if(line[i] === quoteChar){
          state = mode.quote;
        }
        else if(line[i] === commentChar){
          break;
        }
        else{
          word.push(line[i]);
          state = mode.section;
        }
      }
      else if(state === mode.section){
        if(line[i] === spaceChar){
          state = mode.ready;
          wordList.push(word.join(''));
          word = [];
        }
        else if(line[i] === quoteChar){
          //throw new Error('section mode shoult not meet quote char');
          wordList.push(word.join(''));
          word = [];
          state = mode.quote;
        }
        else if(line[i] === commentChar){
          wordList.push(word.join(''));
          word = [];
          break;
        }
        else{
          word.push(line[i]);
        }
      }
      else if(state === mode.quote){
        if(line[i] === spaceChar){
          word.push(line[i]);
        }
        else if(line[i] === quoteChar){
          wordList.push(word.join(''));
          word = [];
          state = mode.ready;
        }
        else if(line[i] === commentChar){
          word.push(line[i]);
        }
        else{
          word.push(line[i]);
        }
      }
    }
    return wordList;
  }



  function parseBlock(wordList){
    var rStack = [],
        i,j = 0,
        stackLeftBrace = [];
    for(i = 0; i < wordList.length; i++){
      if(wordList[i] === '{'){
        rStack.push(wordList[i]);
        stackLeftBrace.push(j);
        j++;
      }
      else if(wordList[i] === '}'){
        var lastLeftBrace = stackLeftBrace.pop();
        rStack.push(wordList[i]);
        rStack.push(rStack.splice(lastLeftBrace, rStack.length));
        j = lastLeftBrace + 1;
      }
      else{
        rStack.push(wordList[i]);
        j++;
      }
    }
    return rStack;
  }

  function isNumber(obj){
    if(obj !== null && !isNaN(obj)){
      return true;
    }
    return false;
  }

  function isArray(obj) { 
    return Object.prototype.toString.call(obj) === '[object Array]';   
  }


  function parseNifix(wordBlock){
    var i = 0,
        stack = [];
    if(!isArray(wordBlock)){
      return wordBlock;
    }
    while(i < wordBlock.length){
      
      if(nifixList.indexOf(wordBlock[i]) === -1){
        stack.push(parseNifix(wordBlock[i]));
        i += 1;
      }
      else{
        stack.push([wordBlock[i], stack.pop(), parseNifix(wordBlock[i+1])]);
        i += 2;
      }
    }
    return stack;
  }


  function eqFind(tree, key){
    var i;
    for(i = 0; i < tree.length; i++){
      if(tree[i][0] === '=' && tree[i][1] === key){
        return tree[i][2];
      }
    }
  }

  function eqFindAll(tree, key){
    var rl = [],
        i;
    for(i = 0; i < tree.length; i++){
      if(tree[i][0] === '=' && tree[i][1] === key){
        rl.push(tree[i][2]);
      }
    }
    return rl;
  }

  function AST(tree){
    this.tree = tree;
  }
  AST.prototype.find = function(key){
    return new AST(eqFind(this.tree, key));
  }
  AST.prototype.findall = function(key){
    return eqFindAll(this.tree).map(function(subtree){
      return new AST(subtree);
    });
  }
  AST.prototype.value = function(){
    if(isNumber(this.tree)){
      return Number(this.tree);
    }
    else if(isArray(this.tree) && this.tree[0] === '{'){
      var value = this.tree.map(function(obj){
        var obj2 = new AST(obj);
        return obj2.value();
      });
      return value.slice(1, value.length - 1);
    }
    return this.tree;
  }

  function parse(data){
    //var data = fs.readFileSync('00_eng_tech.txt', 'utf-8');
    var lines = data.split('\n');
    var wordLines = lines.map(cutLine);
    var wordChain = Array.prototype.concat.apply([],wordLines);
    var wordBlock = parseBlock(wordChain);
    var wordTree = parseNifix(wordBlock);
    return wordTree
  }

  function test(){
    var fs = require('fs');
    var data = fs.readFileSync('00_eng_tech.txt', 'utf-8');
    var tree = new AST(parse(data));

    const repl = require('repl');
    repl.start('> ');
  }
  
  return {parse : parse,
          cutLine : cutLine,
          AST : AST
          
          };

}());
//global.eqFind = eqFind;
//global.eqFindAll = eqFindAll;

