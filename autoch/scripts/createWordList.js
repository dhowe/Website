const CCDICT = "../data/cc-cedict.json";
const HANZI = "../chardata.json";

let lang = 'simplified'; //'traditional'; // keep long form
let maxlen = 2;

//////////////////////////////////////////////////////////////////////

let output, fs = require("fs");
let args = process.argv.slice(2);
let indent = args.length && args[0] == '-i';
let entries = JSON.parse(fs.readFileSync(CCDICT, 'utf8'));
let lookup = JSON.parse(fs.readFileSync(HANZI, 'utf8'));

if (args.length && args[0] == 'simplified' || args[0] == 'traditional') lang  = args[0];
if (args.length > 1 && args[1] == '-i') indent = true;


console.log("LANG:"+lang, output);
output = 'words-' + lang.substring(0, 4);

let words = {};
let doubles = 0;
let adjustedDefs = 0;
for (let i = 0; i < entries.length; i++) {
  let e = entries[i][lang];

  // is it a 2-length word with both parts in the hanzi data?
  if (e.length <= maxlen && doLookup(lookup, e)) {

    // skip two-word chars with both chars the same
    if (e.length == 2 && e[0] == e[1]) {
      doubles++;
      continue;
    }

    if (entries[i].hasOwnProperty('definitions')) {
      let def = entries[i].definitions[0];
      words[e] = def.replace(/\([^)]+\)/g,'').replace(/\[[^\]]+\]/g,'').trim();
      if (words[e].length == 0 && def.length > 0) words[e] = def.replace(/[()]/g,'');
      if (words[e] != def) adjustedDefs++;
      //console.log("Def: "+def+"\n  -> '"+words[e]+"'");
    }
  }
}

console.log("Found " + Object.keys(words).length + " words ("+doubles+" bad doubles)");
console.log("Adjusted " + adjustedDefs + " definitions");

let json = indent ? JSON.stringify(words, null, 2) : JSON.stringify(words);
if (maxlen != 2) output += maxlen;
output += (indent ? "-hr" : "") + ".json";
fs.writeFileSync(output, json);

console.log("Wrote JSON to " + output);


//////////////////////////////////////////////////////////////////////

function doLookup(data, e) {
  for (let i = 0; i < e.length; i++) {
    if (!data.hasOwnProperty(e[i])) return false;
  }
  return true;
}

function parseHanzi(dict) {
  let hanzi = JSON.parse(fs.readFileSync(dict, 'utf8'));
  console.log(lines.length + " lines");
  let chars = {};
  lines.forEach(line => {
    if (!line) return;
    let data = JSON.parse(line);
    let dcom = data.decomposition;
    if (data.decomposition.length == 3) {
      chars[data.character] = 1;
    }
  });

  return chars;
}
