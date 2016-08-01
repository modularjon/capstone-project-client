'use strict';

const paper = require('paper');

// literal definition in lieu of a future pallette
let pixelColor = 'red';

// variable to hold exported svg
let svg;

const paperSetup = () => {
  // Get reference to canvas object:
  // let canvas = document.getElementById('myCanvas');
  // Create empty project and view for the canvas:
  paper.setup('myCanvas');

  // set canvas to 256 x 256 pixels
  let canvasDimension = 256;

  paper.view.viewSize = (canvasDimension, canvasDimension);

  // define the grid and include a bad click handler for now
  const drawGridRects = function(gridWidth, gridHeight, canvasSize) {
    let widthPixels = canvasSize.width / gridWidth;
    let heightPixels = canvasSize.height / gridHeight;
    for (let i = 0; i < gridWidth; i++) {
      for (let j = 0; j < gridHeight; j++) {
        let paperPixel = new paper.Path.Rectangle(canvasSize.left + i * widthPixels, canvasSize.top + j * heightPixels, widthPixels, heightPixels);
        paperPixel.strokeColor = 'grey';
        paperPixel.fillColor = 'white';

        paperPixel.onClick = function(event) {
          this.fillColor = pixelColor;
        };
      }
    }
  };

  // creates the grid
  drawGridRects(16, 16, paper.view.bounds);

  // draws the view
  paper.view.draw();
};

const exportSVG = function() {
  svg = paper.project.exportSVG({asString: true});
  console.log(svg);
};

const importSVG = function() {
  paper.project.clear();
  paper.project.importSVG(svg);
};

const getPaletteColor = function(event) {
  console.log(event.target);
  console.log($(event.target).css('background-color'));
  pixelColor = $(event.target).css('background-color');
};

const addHandlers = () => {
  paperSetup();
  $('.exportSVG').on('click', exportSVG);
  $('.importSVG').on('click', importSVG);
  $('.palette').on('click', getPaletteColor);
};

module.exports = {
  addHandlers,
};
