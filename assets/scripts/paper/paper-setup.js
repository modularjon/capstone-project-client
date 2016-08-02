'use strict';

const paper = require('paper');
const api = require('./paper-api');
const ui = require('./paper-ui');

// literal definition in lieu of a future pallette
let pixelColor;

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
      }
    }
  };

  // creates the grid
  drawGridRects(16, 16, paper.view.bounds);

  paper.view.onClick = function(event) {
    let i = paper.project.hitTest(event.point).item.index;
    paper.project.activeLayer.children[i].fillColor = pixelColor;
  };

  // draws the view
  paper.view.draw();
};

const exportJSON = function() {
  svg = paper.project.exportJSON({asString: true});
  console.log(svg);

  let data = {
    "post": {
      "title": "My post",
      "content": svg
    }
  };

  console.log(data);
  api.createPost(data)
    .done(ui.success)
    .fail(ui.failure);
};

const importJSON = function() {
  paper.project.clear();
  paper.project.importJSON(svg);
};

const getPaletteColor = function(event) {
  pixelColor = $(event.target).css('background-color');
};

const addHandlers = () => {
  paperSetup();
  $('.exportSVG').on('click', exportJSON);
  $('.importSVG').on('click', importJSON);
  $('.palette').on('click', getPaletteColor);
};

module.exports = {
  addHandlers,
};
