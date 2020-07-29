let fs = require('fs');
let lines = fs.readFileSync('data/sensitive.txt', 'utf8').split('\n');
var s = '';
lines.forEach(function (l) {
  var word = l.split('|')[0];
  if (word.length == 2)
    s += word + '\n';
});
console.log(s);
