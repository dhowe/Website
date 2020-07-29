if (typeof Path2D == 'undefined') Path2D = (class Path2DMock {});

let fs = require('fs');
let lev = require('fast-levenshtein');
let CharUtils  = require('../cutils.js');
let Autochar  = require('../autochar.js');

let chars = JSON.parse(fs.readFileSync("../chardata.json", 'utf8'));
let trad, simp;

// both langs by default -- to use one, comment either below
//trad = JSON.parse(fs.readFileSync('../words-trad.json', 'utf8')); // comment
simp = JSON.parse(fs.readFileSync('../words-simp.json', 'utf8')); // comment

let util = new CharUtils(chars, trad ? trad : 0, simp ? simp : 0, lev);

millis = function () { return +Date.now(); }
textWidth = function () { return -1; }
textAscent = function () { return -1; }
textDescent = function () { return -1; }

let word, count = 1;
let args = process.argv.slice(2);
let numlines = args && args[0] || 10;
let writeFile = (args && args.length > 1 && args[1] == '-f');
let edgeFile = 'live-edges-'+util.language()+'-'+numlines+'.'+millis()+'.csv';
let edgeData = 'source,target,med,step\n';

typer = new Autochar(util, onActionComplete, null);
if (!(trad && simp)) typer.disableTriggers();

if (writeFile) console.log('target: ' + edgeFile)

word = typer.word.literal;
step();

function step() {
  typer.step();
  if (count <= numlines) {

    setTimeout(step, 1);

  } else {

    //console.log(edgeData);
    if (writeFile) {
      fs.appendFileSync(edgeFile, edgeData);
      console.log('wrote: ' + edgeFile)
    }
  }
}

function onActionComplete(next, med) {
  if (next) {
    if (word) {
      var line = word + ',' + next.literal + ',' + med;
      if (writeFile) edgeData += line + ','+count+'\n';
      else console.log(line);
    }
    word = next.literal;
    if (++count % 200 == 0) {
      fs.appendFileSync(edgeFile, edgeData);
      console.log(Math.floor((count / numlines) * 1000) / 10 + '% complete');
      edgeData = '';
    }
  }
}
