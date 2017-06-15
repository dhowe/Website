var gridW = 8, gridH = 8; // 8
var cellW = 90, cellH = 90;
var imgW = 110, imgH = 110;
var winW = 630, winH = 630;
var winW = 720, winH = 720;

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

  readJSONAndCreateGrid();
}

function draw() {
  if (loaded) drawBG();
}

function readJSONAndCreateGrid() {
  var cells;

  var processJSON = $.getJSON("cells.json", function(json) {
    cells = json.cells;
  });

  processJSON.done(function(cells) {
    createGrid(cells);
    //console.log (cells[0].url);
    loaded = true;
  });
}

function createGrid(cells) {
  //console.log ("cells num: ", cells.length);
  var cellsIndex = 0;

  grid = new Array(gridH);
  for (var i = 0; i < gridH; i++) {
    grid[i] = new Array(gridW);
  }

  for (var i = 0, currentNumber = 0; i < gridH; i++) {
    for (var j = 0; j < gridW; j++, currentNumber++) {

      grid[i][j] = { x: cellW * j, y: cellH * i };

      if (i % 2 == 0) {

        if (currentNumber % 2 == 0) {

          grid[i][j].thumb = loadImage(cells[cellsIndex % cells.length].img);
          grid[i][j].link = cells[cellsIndex % cells.length].url;
          grid[i][j].clickable = true;

        } else {

          grid[i][j].descr = cells[cellsIndex % cells.length].description;
          grid[i][j].clickable = false;

          cellsIndex++;
        }
      } else {

        var startingIndex;

        if (j == 0) {

          grid[i][j].descr = cells[cellsIndex % cells.length].description;
          grid[i][j].clickable = false;

          startingIndex = cellsIndex % cells.length;

        } else if (j == gridH - 1) {

          grid[i][j].thumb = loadImage(cells[startingIndex].img);
          grid[i][j].link = cells[startingIndex].url;
          grid[i][j].clickable = true;

          cellsIndex++;

        } else if (currentNumber % 2 == 1) {

          grid[i][j].thumb = loadImage(cells[(cellsIndex + 1) % cells.length].img);
          grid[i][j].link = cells[(cellsIndex + 1) % cells.length].url;
          grid[i][j].clickable = true;

        } else {

          grid[i][j].descr = cells[(cellsIndex + 1) % cells.length].description;
          grid[i][j].clickable = false;

          cellsIndex++;
        }
      }
    }
  }
}

function drawBG() {
  background(255, 255, 255);
  for (var i = 0; i < gridH; i++) {
    for (var j = 0; j < gridW; j++) {
      // move tiles
      if (mouseX >= 0 && mouseX < width * 0.1) {
        // left area

        if (grid[i][j].x >= width) grid[i][j].x = 0; // -cellW

        grid[i][j].x += speed;
      } else if (mouseX <= width && mouseX > width * 0.9) {
        // right area

        if (grid[i][j].x <= -cellW) grid[i][j].x = width - cellW; // width

        grid[i][j].x -= speed;
      }

      if (mouseY >= 0 && mouseY < height * 0.1) {
        // top area

        if (grid[i][j].y >= height) grid[i][j].y = 0; // -cellH

        grid[i][j].y += speed;

      } else if (mouseY <= height && mouseY > height * 0.9) {
        // down area

        if (grid[i][j].y <= -cellH) grid[i][j].y = height - cellH; // height

        grid[i][j].y -= speed;
      }

      // show picture
      if (grid[i][j].thumb) {

        image(grid[i][j].thumb, grid[i][j].x, grid[i][j].y, cellW, cellH);

        // left and right respectively
        if (grid[i][j].x + cellW > width) {
          image(
            grid[i][j].thumb,
            grid[i][j].x - width,
            grid[i][j].y,
            cellW,
            cellH
          );
          if (
            grid[i][j].y < 0 // bottom-left area
          )
            image(
              grid[i][j].thumb,
              grid[i][j].x - width,
              grid[i][j].y + height,
              cellW,
              cellH
            );
          else if (
            grid[i][j].y >
            height - cellH // top-left area
          )
            image(
              grid[i][j].thumb,
              grid[i][j].x - width,
              grid[i][j].y - height,
              cellW,
              cellH
            );
        } else if (grid[i][j].x < 0) {
          image(
            grid[i][j].thumb,
            grid[i][j].x + width,
            grid[i][j].y,
            cellW,
            cellH
          );

          if (
            grid[i][j].y < 0 // bottom-right
          )
            image(
              grid[i][j].thumb,
              grid[i][j].x + width,
              grid[i][j].y + height,
              cellW,
              cellH
            );
          else if (
            grid[i][j].y >
            height - cellH // top-right
          )
            image(
              grid[i][j].thumb,
              grid[i][j].x + width,
              grid[i][j].y - height,
              cellW,
              cellH
            );
        }

        // top and bottom respectively
        if (grid[i][j].y + cellH > height) {
          image(
            grid[i][j].thumb,
            grid[i][j].x,
            grid[i][j].y - height,
            cellW,
            cellH
          );
        } else if (grid[i][j].y < 0) {
          image(
            grid[i][j].thumb,
            grid[i][j].x,
            grid[i][j].y + height,
            cellW,
            cellH
          );
        }

        // show text description
        if (
          mouseX >= grid[i][j].x &&
          mouseX <= grid[i][j].x + cellW &&
          mouseY >= grid[i][j].y &&
          mouseY <= grid[i][j].y + cellH
        ) {
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
