if (typeof Path2D == 'undefined') Path2D = (class Path2DMock {});

let fs = require('fs');
let lev = require('fast-levenshtein');
let CharUtils  = require('../cutils.js');
let Autochar  = require('../autochar.js');

let timer, word, count = 0;
let args = process.argv.slice(2);
let numlines = args && args[0] || 10;
let nodes = {};

let chars = JSON.parse(fs.readFileSync("../chardata.json", 'utf8'));

// comment either to disable -> let trad; //
let trad = JSON.parse(fs.readFileSync('../words-trad.json', 'utf8')); // comment
let simp = JSON.parse(fs.readFileSync('../words-simp.json', 'utf8')); // comment
let util = new CharUtils(chars, trad ? trad : 0, simp ? simp : 0, lev);

textWidth = function () { return -1; }
textAscent = function () { return -1; }
textDescent = function () { return -1; }
millis = function () { return +new Date(); }
elapsed = function (t) { return millis() - t; };

typer = new Autochar(util, onActionComplete);
if (!(trad && simp)) typer.disableTriggers();
timer = millis();
step();

function onActionComplete(next, med) {
  if (next) {
    if (word) console.log(word + ',' + next.literal + ',' + med);
    word = next.literal;
    count++;
  }
}

function step() {
  typer.step();
  if (count < numlines) {
    setTimeout(step, 1);
  } else {
    var e = elapsed(timer);
    console.log('\nProcessed ' + count + ' steps in ' +
      Math.round(e / 1000) + "s at " + (e / count) + 'ms per-step, '+typer.numTriggers+' triggers');
  }
}
