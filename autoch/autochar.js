// TODO:
//   bug: displayed med is not in sync (shows after word completes)
//   length of stroke to length of sound-sample
//   add 3rd character
//   sort bests by stroke count, pick the closest (part of med?)

//let count = 0; // TMP

if (typeof module != 'undefined' && process.versions.hasOwnProperty('electron')) {
  //Tone = require("Tone");
  Tone = require("./node_modules/tone/build/Tone.min.js");
}

const FORCE_CHARACTER = false; // '和諧';

const REPLACE_ERASE = 0;
const REPLACE_STROKE = 1;
const DELETE_ACTION = 2;
const INSERT_ACTION = 3;

class Autochar {

  constructor(util, wordCompleteCB, nextTargetCB, testChars) {

    this.target;
    this.tid = -1;
    this.med = -1;
    this.util = util;
    this.numTriggers = 0;
    this.targetCharIdx = -1;
    this.targetPartIdx = -1;
    this.currentStrokeCount = 0;
    this.triggers = TRIGGERS;
    this.leftStatics = 0;
    this.rightStatics = 0;

    if (testChars) {
      this.word = this.mockWord(testChars);
      return;
    }

    this.wordCompleteCallback = wordCompleteCB;
    this.nextTargetCallback = nextTargetCB;

    this.word = util.randWord(2);
    // tmp this.word = this.util.getWord('和諧');
    this.memory = new util.HistQ(10);
    this.memory.add(this.word.literal);
    this.memory.add('trigger');
  }

  disableTriggers() {
    this.triggers = undefined;
  }

  mockWord(chars) {
    var c1 = util.randKey(chars);
    var c2 = util.randKey(chars);
    return util._createWord(c1 + c2, chars);
  }

  draw(renderer, rgb) {

    this.renderWord(this.word, renderer, .85, 80, 30, rgb);
  }

  step() { // returns the next action to be done

    if (!this.target) {
      let trigd = this.pickNextTarget();
      this.findEditIndices();
      if (this.nextTargetCallback) {
        this.nextTargetCallback(this.target.literal, this.currentStrokeCount, trigd);
      }
    }

    this.doNextEdit();

    return this.action;
  }

  candidates(minAllowed) {

    let opts = [];
    let minMed = minAllowed || 1;

    let rightSideFail = this.rightStatics > this.memory.size();
    let leftSideFail = this.leftStatics > this.memory.size();

    while (!opts || !opts.length) {

      opts = this.util.bestEditDistance(this.word.literal, 0, this.memory, minMed);


      if (!opts || !opts.length) {
        throw Error('Died on ' + this.word.literal, this.word);
      }

      // alternate characters when possible
      if (!rightSideFail && !leftSideFail) {
        if (this.targetCharIdx > -1) {
          let ideals = [];
          let justChanged = this.word.literal[this.targetCharIdx];
          //console.log('justChanged', justChanged);
          for (var i = 0; i < opts.length; i++) {
            if (opts[i][this.targetCharIdx] === justChanged) {
              ideals.push(opts[i]);
            }
          }
          //console.log('opts  ', opts.length, JSON.stringify(ideals));
          //console.log('ideals', ideals.length, JSON.stringify(ideals));
          if (ideals.length) opts = ideals;
        }
      }
      else {
        var repairs = [];
        if (rightSideFail) {
          console.error('!!! VIOLATION(R) '+ this.word.literal);
          for (var i = 0; i < opts.length; i++) {
            if (opts[i][1] !== this.word.literal[1]) {
              repairs.push(opts[i]);
            }
          }
          console.log('repairs: '+repairs);
        }
        else if (leftSideFail) {
          console.error('!!! VIOLATION(L) ' +this.word.literal);
          for (var i = 0; i < opts.length; i++) {
            if (opts[i][0] !== this.word.literal[0]) {
              repairs.push(opts[i]);
            }
          }
          console.log('repairs: '+repairs);
        }
        if (repairs.length) {
           opts = repairs;
        }
        else {
          minMed++;
          opts = undefined;
          console.log('Failed to find repair: incrementing MED to '+minMed);
        }
      }
    }

    return opts;
  }

  pickNextTarget() {

    // get our MED candidates
    let result, opts = this.candidates();
    //console.log('BEDs: ' + opts.length+"\n");

    // select any trigger words if we have them
    let triggered = false;
    if (this.triggers && !this.memory.contains('trigger')) {
      var startIdx = (Math.random() * opts.length) << 0;
      OUT: for (var i = startIdx; i < opts.length+startIdx; i++) {
        var cand = opts[i % opts.length];
        for (var j = 0; j < cand.length; j++) {
          var char = cand[j];
          if (this.triggers.indexOf(char) > -1) {
            result = this.util.getWord(cand);
            triggered = true;
            this.numTriggers++;
            break OUT;
          }
        }
      }
    }

    // otherwise pick a random element from the list
    if (!result) {
      result = this.util.getWord(opts[(Math.random() * opts.length) << 0]);
    }

    FORCE_CHARACTER && (result = this.util.getWord('和諧'));

    // check neither character has stayed the same for too long
    this.rightStatics = result.literal[1] === this.word.literal[1] ? this.rightStatics + 1 : 0;
    this.leftStatics = result.literal[0] === this.word.literal[0] ? this.leftStatics + 1 : 0;

    // update the new target and MED
    this.med = this.util.minEditDistance(this.word.literal, result.literal);
    this.memory.add(result.literal);
    this.target = result;

    // if its a trigger word, swap languages
    if (triggered) {
      console.log('trigger: "' + char + '" in "' + result.literal + '" -> ' +
        (this.util.lang === 'simp' ? 'trad' : 'simp'));
      this.util.toggleLang();
      this.memory.add('trigger');
    }

    return triggered;
    //console.log("WORD: ", this.word, "\nNEXT: ", this.target, "\nMED: ", this.med);
  }

  doNextEdit() {

    if (this.action == REPLACE_ERASE) {
      if (!this.word.eraseStroke(this.targetCharIdx, this.targetPartIdx)) {
        // erasing done, now replace
        this.word = this.target;
        this.word.hide(); // TODO: simplify to one function
        this.word.show(this.targetCharIdx, this.targetPartIdx == 1 ? 0 : 1);
        this.word.show(this.targetCharIdx == 1 ? 0 : 1);
        this.action = REPLACE_STROKE;
        //return;
      }
      // else this.wordCompleteCallback(); // erase stroke change
    }

    if (this.action == REPLACE_STROKE) {
      if (this.word.nextStroke(this.targetCharIdx, this.targetPartIdx)) {
        this.wordCompleteCallback(); // draw stroke change
      } else { // flash
        this.wordCompleteCallback(this.word, this.med); // word change
        this.target = null;
      }
    }
  }

  findEditIndices() {

    this.targetCharIdx = -1;
    this.targetPartIdx = -1;

    if (this.target.length === this.word.length) {

      this.action = REPLACE_ERASE;

      for (var i = 0; i < this.word.length; i++) {
        if (this.word.literal[i] !== this.target.literal[i]) {
          this.targetCharIdx = i;
          let wchr = this.word.characters[i];
          let tchr = this.target.characters[i];
          //console.log('wchr',wchr);
          for (var j = 0; j < wchr.parts.length; j++) {

            // check the number of strokes in each part
            // if they don't match then this part needs updating
            if (wchr.cstrokes[j].length !== tchr.cstrokes[j].length) {
              this.targetPartIdx = j;

              // compute the number of strokes that need to be drawn
              if (j < 0) console.log('***pidx=' + j, this.word.literal, this.med);
              if (i > -1 && j > -1) {
                this.currentStrokeCount = tchr.paths[j].length;
              }
            }
          }
        }
      }

      //console.log('strokes: '+this.currentStrokeCount);

    } else if (this.target.length > this.word.length) {
      this.action = INSERT_ACTION; // TODO

    } else if (this.target.length < this.word.length) {
      this.action = DELETE_ACTION; // TODO
    }

    //console.log('target=' + this.target.literal[this.targetCharIdx]
    //+', charIdx=' + this.targetCharIdx + ', pIdx=' + this.targetPartIdx);
  }

  renderWord(word, renderer, scale, xoff, yoff, rgb) {
    if (word.characters) {
      for (var i = 0; i < word.characters.length; i++) {
        if (word.literal[i] !== ' ')
          this.util.renderPath(word, i, renderer, scale, xoff, yoff, rgb);
      }
    }
  }
}

const TRIGGERS = '屄妓刘陆肏毛嫖裸婊奸姦尻淫習习審审國国藝艺罰罚監监獄狱網网書书報报黨党強强憲宪權权規规夢梦變变競竞爭争錯错謬谬惡恶壞坏愛爱衛卫華华賣卖讀读學学檢检驗验戰战鬥斗敵錢钱異异雜杂亂乱法假反翻叛泄控官革斃毙民罪犯真信廉暴軍压壓迫逼毒獨独抗違违廢废捕皇严嚴仇敌敵霸牢禁罷罢憂忧侵窺窥佔騙骗贪貪贿賄';

if (typeof module != 'undefined') module.exports = Autochar;
