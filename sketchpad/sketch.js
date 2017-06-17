var gridW = 6, gridH = 6; // 8
var winW = 600, winH = 600;

var cellW = winW / gridW, cellH = winH / gridH;
var speed = 5, xStart = 0 - cellW / 2, yStart = 0 - cellH / 2;
var xPos = xStart, yPos = yStart, cellNum = 0;
var grid, loaded = false;

function setup() {
  createCanvas(winW, winH);

  textFont("Arial");
  textStyle(NORMAL);
  fill(51, 51, 51);
  textLeading(11);
  textSize(9);
  noStroke();

  frameRate(24);
  $.getJSON("data.json", createGrid);
}

function draw() {
  if (loaded) drawBG();
}

function createGrid(data) {
  var cells = data.cells;

  grid = new Array(gridH);

  console.log("cells num: ", cells.length);

  for (var i = 0, cidx = 0, currentNumber = 0; i < gridH; i++) {
    for (var j = 0; j < gridW; j++, currentNumber++) {
      //if (j === 0) grid[i] = new Array(gridW);

      var cell = { x: cellW * j, y: cellH * i, clickable: false };

      //if (i === currentNumber) console.log("NOPE");
      if (i % 2 == 0) {
        if (currentNumber % 2 == 0) {
          cell.thumb = loadImage(cells[cidx % cells.length].img);
          cell.link = cells[cidx % cells.length].url;
          cell.clickable = true;
        } else {
          cell.descr = cells[cidx++ % cells.length].description;
        }
      } else {
        var startingIndex;

        if (j == 0) {
          cell.descr = cells[cidx % cells.length].description;
          startingIndex = cidx % cells.length;
        } else if (j == gridH - 1) {
          cell.thumb = loadImage(cells[startingIndex].img);
          cell.link = cells[startingIndex].url;
          cell.clickable = true;

          cidx++;
        } else if (currentNumber % 2 == 1) {
          cell.thumb = loadImage(cells[(cidx + 1) % cells.length].img);
          cell.link = cells[(cidx + 1) % cells.length].url;
          cell.clickable = true;
        } else {
          cell.descr = cells[(cidx++ + 1) % cells.length].description;
        }
      }
      if (j === 0) grid[i] = [];
      grid[i][j] = cell;
    }
  }

  loaded = true;
}
var calls = 0, logCalls = true;
function _image() {
  image.apply(this, arguments);
  calls++;
}

function shiftForMouse(i,j) {
  if (mouseX >= 0 && mouseX < width * 0.1) { // left area

    if (grid[i][j].x >= width)
      grid[i][j].x = 0; // -cellW

    grid[i][j].x += speed;

  } else if (mouseX <= width && mouseX > width * 0.9) { // right area

    if (grid[i][j].x <= -cellW)
      grid[i][j].x = width - cellW; // width

      grid[i][j].x -= speed;
  }

  if (mouseY >= 0 && mouseY < height * 0.1) {
    // top area

    if (grid[i][j].y >= height)
      grid[i][j].y = 0; // -cellH

    grid[i][j].y += speed;

  } else if (mouseY <= height && mouseY > height * 0.9) { // down area

    if (grid[i][j].y <= -cellH)
      grid[i][j].y = height - cellH; // height

    grid[i][j].y -= speed;
  }
}

function drawBG() {

  background(255, 255, 255);

  for (var i = 0; i < gridH; i++) {
    for (var j = 0; j < gridW; j++) {

      shiftForMouse(i,j);

      if (!grid[i][j].thumb) continue;

      // left and right respectively
      if (grid[i][j].x + cellW > width) {

        _image(
          grid[i][j].thumb,
          grid[i][j].x - width,
          grid[i][j].y,
          cellW,
          cellH
        );

        if (grid[i][j].y < 0 ) {// bottom-left area
          _image(
            grid[i][j].thumb,
            grid[i][j].x - width,
            grid[i][j].y + height,
            cellW,
            cellH
          );
        } else if (grid[i][j].y > height - cellH) // top-left area
          _image(
            grid[i][j].thumb,
            grid[i][j].x - width,
            grid[i][j].y - height,
            cellW,
            cellH
          );

      } else if (grid[i][j].x < 0) {

        _image(
          grid[i][j].thumb,
          grid[i][j].x + width,
          grid[i][j].y,
          cellW,
          cellH
        );

        if (grid[i][j].y < 0) { // bottom-right
          _image(
            grid[i][j].thumb,
            grid[i][j].x + width,
            grid[i][j].y + height,
            cellW,
            cellH
          );

        } else if (grid[i][j].y > height - cellH) {// top-right
          _image(
            grid[i][j].thumb,
            grid[i][j].x + width,
            grid[i][j].y - height,
            cellW,
            cellH
          );
        }
      }

      // top and bottom respectively
      if (grid[i][j].y + cellH > height) {
        _image(
          grid[i][j].thumb,
          grid[i][j].x,
          grid[i][j].y - height,
          cellW,
          cellH
        );

      } else if (grid[i][j].y < 0) {
        _image(
          grid[i][j].thumb,
          grid[i][j].x,
          grid[i][j].y + height,
          cellW,
          cellH
        );
      }


      _image(grid[i][j].thumb, grid[i][j].x, grid[i][j].y, cellW, cellH);


      // show text description

      if (mouseX >= grid[i][j].x &&
        mouseX <= grid[i][j].x + cellW &&
        mouseY >= grid[i][j].y &&
        mouseY <= grid[i][j].y + cellH)
      {
        var nextI = 0, nextJ = 0;

        if (i % 2 == 1 && j == gridW - 1) {
          // even rows and last element
          nextJ = 0;
          nextI = i;
        } else if (j + 1 == gridW && i * j + 1 < gridH * gridW) {
          nextJ = j;
          if (i + 1 < gridH) nextI = i + 1;
          else nextI = i;
          //prvarln("nextI");
        } else if (j + 1 < gridW) {
          nextJ = j + 1;
          nextI = i;
          //prvarln("nextJ");
        } else {
          nextJ = j;
          nextI = i;
        }

        text(
          grid[nextI][nextJ].descr,
          grid[nextI][nextJ].x + 2,
          grid[nextI][nextJ].y,
          cellW - 4,
          cellH
        );

        // left and right respectively
        if (grid[nextI][nextJ].x + cellW > width) {
          text(
            grid[nextI][nextJ].descr,
            grid[nextI][nextJ].x + 2 - width,
            grid[nextI][nextJ].y,
            cellW - 4,
            cellH
          );

          if (
            grid[nextI][nextJ].y < 0 // bottom-left area
          )
            text(
              grid[nextI][nextJ].descr,
              grid[nextI][nextJ].x + 2 - width,
              grid[nextI][nextJ].y + height,
              cellW - 4,
              cellH
            );
          else if (
            grid[i][j].y >
            height - cellH // top-left area
          )
            text(
              grid[nextI][nextJ].descr,
              grid[nextI][nextJ].x + 2 - width,
              grid[nextI][nextJ].y - height,
              cellW - 4,
              cellH
            );
        }
        if (grid[nextI][nextJ].x < 0) {
          text(
            grid[nextI][nextJ].descr,
            grid[nextI][nextJ].x + 2 + width,
            grid[nextI][nextJ].y,
            cellW - 4,
            cellH
          );

          if (
            grid[nextI][nextJ].y < 0 // bottom-right
          )
            text(
              grid[nextI][nextJ].descr,
              grid[nextI][nextJ].x + 2 + width,
              grid[i][j].y + height,
              cellW - 4,
              cellH
            );
          else if (
            grid[nextI][nextJ].y >
            height - cellH // top-right
          )
            text(
              grid[nextI][nextJ].descr,
              grid[nextI][nextJ].x + 2 + width,
              grid[nextI][nextJ].y - height,
              cellW - 4,
              cellH
            );
        }

        // top and bottom respectively
        if (grid[nextI][nextJ].y + cellH > height) {
          text(
            grid[nextI][nextJ].descr,
            grid[nextI][nextJ].x + 2,
            grid[nextI][nextJ].y - height,
            cellW - 4,
            cellH
          );
        }
        if (grid[nextI][nextJ].y < 0) {
          text(
            grid[nextI][nextJ].descr,
            grid[nextI][nextJ].x + 2,
            grid[nextI][nextJ].y + height,
            cellW - 4,
            cellH
          );
        }
      }

    }
  }
  if (logCalls) {
    logCalls = false;
    console.log(calls);
  }
}

function mousePressed() {
  for (var i = 0; i < gridH; i++) {
    for (var j = 0; j < gridW; j++) {
      if (
        grid[i][j].clickable &&
        mouseX >= grid[i][j].x &&
        mouseX <= grid[i][j].x + cellW &&
        mouseY >= grid[i][j].y &&
        mouseY <= grid[i][j].y + cellH
      ) {
        window.open(grid[i][j].link);
        return;
      }
    }
  }
}
