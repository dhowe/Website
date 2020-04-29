if (typeof Path2D == 'undefined') Path2D = (class Path2DMock {});

let lang = 'trad';
let fs = require('fs');
let CharUtils = require('../cutils');

let words = JSON.parse(fs.readFileSync('../words-'+lang+'.json', 'utf8'));
let chars = JSON.parse(fs.readFileSync('../chardata.json', 'utf8'));
let util = new CharUtils(chars, words, null, require('fast-levenshtein'));

let args = process.argv.slice(2);
let maxAllowedMed = args && Math.min(args[0],10) || 10;
let writeFile = (args && args.length > 1 && args[1] == '-f');
let edgeFile = 'edges-dist-'+lang+maxAllowedMed+'.csv';
let keys = Object.keys(words);

if (writeFile) console.log('Target file: '+edgeFile);

let edgeData = 'source,target,med\n';

for (var i = 0; i < keys.length; i++) {
  for (var j = 0; j < keys.length; j++) {
    if (i == j) continue;
    var word1 = keys[i], word2 = keys[j];
    var med = util.minEditDistance(word1, word2);
    if (med <= maxAllowedMed) {
        var line = word1+','+word2+','+med;
        if (writeFile) {
          edgeData += line + "\n";
        }
        else console.log(line);
    }
  }
  if (writeFile && i%100==0) {
    console.log(Math.floor((i/keys.length)*1000)/10+'% complete');
    fs.appendFileSync(edgeFile, edgeData);
    edgeData = '';
  }
}

if (writeFile) {
  fs.appendFileSync(edgeFile, edgeData);
  console.log('Wrote file: '+edgeFile);
}
