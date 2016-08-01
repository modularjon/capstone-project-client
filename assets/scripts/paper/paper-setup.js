'use strict';

const paper = require('paper');

const paperSetup = () => {
  // Get reference to canvas object:
  // let canvas = document.getElementById('myCanvas');
  // Create empty project and view for the canvas:
  paper.setup('myCanvas');

// set canvas to 256 x 256 pixels
  let canvasDimension = 256;

  paper.view.viewSize = (canvasDimension, canvasDimension);

// literal definition in lieu of a future pallette
  let pixelColor = 'red';

// define the grid and include a bad click handler for now
  const drawGridRects = function(gridWidth, gridHeight, canvasSize) {
    let widthPixels = canvasSize.width / gridWidth;
    let heightPixels = canvasSize.height / gridHeight;
    for (let i = 0; i < gridWidth; i++) {
      for (let j = 0; j < gridHeight; j++) {
        let paperPixel = new paper.Path.Rectangle(canvasSize.left + i * widthPixels, canvasSize.top + j * heightPixels, widthPixels, heightPixels);
        paperPixel.strokeColor = 'white';
        paperPixel.fillColor = 'black';

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

const addHandlers = () => {
  paperSetup();
};

module.exports = {
  addHandlers,
};
