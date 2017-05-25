var NUM_LINES = 7, DISPLAY_WIDTH = 495, DISPLAY_X = 113, LEADING = 40;

var words, lineW = 0, spaceW, arrowSpeed = -1, shift;
var lerpValue = 0, speed = 0.1, dragging, mouseDownX;
var numLinesBelow, lines = [], showBorder = true;
var font, textWidths = {};

function preload() {

  font = loadFont("Baskerville.ttf");
  words = loadStrings("misspeltLandings.txt");
}

function setup() {

  createCanvas(727, 387);
  background(255);
  frameRate(50);

  fill(0);
  textSize(36);
  if (font) textFont(font);

  spaceW = cachedTextWidth(" ");
  words = words[0].split(" ");

  for (var i = 0; i < words.length; i++) {
    lineW += cachedTextWidth(words[i]) + (i === 0 ? 0 : spaceW);
  }

  numLinesBelow = floor(NUM_LINES / 2);

  doInitialLayout();
}

function draw() {

  background(255);
  noStroke();

  if (abs(lerpValue) > 1 && !dragging)
    lerpValue = Math.sign(lerpValue) * abs(lerp(lerpValue * speed, 0, 10));
  shift = lerpValue;

  // draw the lines of text
  var yOff = height / 2 + 5;
  textLine(words, lines[numLinesBelow], yOff);
  for (var i = numLinesBelow + 1; i < NUM_LINES; i++) {
    textLine(words, lines[i], (yOff += LEADING));
  }

  yOff = height / 2 + 5;
  for (var i = numLinesBelow - 1; i >= 0; i--) {
    textLine(words, lines[i], (yOff -= LEADING));
  }

  // but use arrows if specified
  if (arrowSpeed != 0) shift = arrowSpeed;

  // and keep a minimum speed
  if (abs(shift) < 1) shift = shift < 0 ? -1 : 1;

  for (var i = 0; i < NUM_LINES; i++)
    shiftLine(i, shift);

  drawBorders();
}

function shiftLine(lineIdx, offset) {

  if (offset != 0) {
    lines[lineIdx] += offset;

    if (offset < 0 && offScreenLeft(lines[lineIdx] + lineW)) {
      lines[lineIdx] += lineW + spaceW;
    } else if (offset > 0 && offScreenRight(lines[lineIdx] - lineW)) {
      lines[lineIdx] -= lineW + spaceW;
    }
  }
}

function cachedTextWidth(word) {

  var result = textWidths[word];
  if (!result) {
     result = textWidth(word);
     textWidths[word] = result;
  }
  return result;
}

function textLine(words, x, y) {

  var dbug = 0, log = dbug ? '' : null, cursor = x;

  for (var i = 0; i < words.length; i++) {

    if (i != 0) {
      var lastWord = words[i - 1], offSet = cachedTextWidth(lastWord) + spaceW;
      cursor += offSet;
    }
    var currentX = cursor;

    // text loop
    if (!offScreenRight(lineEnd(x)) && !offScreenRight(cursor + lineW)) {
      currentX += lineW + spaceW;
    } else if (!offScreenLeft(x) && !offScreenLeft(cursor - lineW + cachedTextWidth(words[i]))) {
      currentX -= lineW + spaceW;
    }

    // only draw text if it is onScreen
    if (!offScreen(currentX, cachedTextWidth(words[i]))) {
      text(words[i], currentX, y);
    }

    if (dbug) log += cursor + ' ';
  }

  if (dbug) console.log(log);
}

function drawBorders() {

  var lx = [ DISPLAY_X, DISPLAY_WIDTH + DISPLAY_X ];
  if (showBorder) {
    fill(30);
    noStroke();
    rect(lx[0] + 1, 0, -lx[0] - 2, height);
    rect(lx[1], 0, width - lx[1], height);
  } else {
    stroke(200, 0, 0);
    for (var i = 0; i < lx.length; i++) {
      line(lx[i], 0, lx[i], height);
    }
  }
}

function doInitialLayout() {

  lines = new Array(NUM_LINES);
  for (var i = 0; i < lines.length; i++) {
    lines[i] = DISPLAY_X;
  }

  // align rows so middle row is at start left
  for (var i = 0; i < NUM_LINES; i++) {
    var offset = DISPLAY_WIDTH * -(i - floor(NUM_LINES / 2));
    if (offset > 0) offset = -1 * (lineW + spaceW - offset);
    lines[i] += offset;
  }
}

function offScreen(c, l) {
  return offScreenRight(c) || offScreenLeft(c + l);
}

function offScreenRight(c) {
  return c > DISPLAY_X + DISPLAY_WIDTH;
}

function offScreenLeft(c) {
  return c < DISPLAY_X;
}

function lineEnd(lineStart) {
  return lineStart + lineW;
}

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
      showBorder = !showBorder;
      break;
    case DOWN_ARROW:
      showBorder = !showBorder;
      break;
    case RIGHT_ARROW:
      arrowSpeed = arrowSpeed > 0 ? arrowSpeed + 1 : 1;
      break;
    case LEFT_ARROW:
      arrowSpeed = arrowSpeed < 0 ? arrowSpeed - 1 : -1;
      break;
  }
}

function mousePressed() {
  mouseDownX = mouseX;
}

function mouseDragged() {
  arrowSpeed = 0;
  dragging = true;
  lerpValue = lerp((mouseX - mouseDownX) * speed, 0, 4);
}

function mouseReleased() {
  dragging = false;
}
