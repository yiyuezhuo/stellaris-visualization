
_parser = require('./parser');
fs = require('fs');

data = fs.readFileSync('00_phys_tech_repeatable.txt', 'utf-8');
lines = data.split('\n');
//wordLines = lines.map(parser.cutLine);
wordLines = lines.map(function(line, i){
  try{
    return parser.cutLine(line);
  }
  catch(err){
    console.log(i, line);
    throw(new Error('shit bug'));
  }
});

rawList = parser.parse(data);
tree = new parser.AST(rawList);

const repl = require('repl');
repl.start('> ');
