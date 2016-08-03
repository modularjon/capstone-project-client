'use strict';

const paper = require('paper');
const getFormFields = require('../../../lib/get-form-fields');

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
  paper.setup('drawing');

  // set canvas to 256 x 256 pixels
  let canvasDimension = 256;

  paper.view.viewSize = (canvasDimension, canvasDimension);

  // define the grid and include a bad click handler for now
  const drawGridRects = function(gridWidth, gridHeight, canvasSize) {
    let widthPixels = canvasSize.width / gridWidth;
    let heightPixels = canvasSize.height / gridHeight;
    for (let i = 0; i < gridWidth; i++) {
      for (let j = 0; j < gridHeight; j++) {
        let paperPixel = new paper.Path.Circle(canvasSize.left + (i + 0.5) * widthPixels, canvasSize.top + (j + 0.5) * heightPixels, widthPixels/2);//, heightPixels);
        paperPixel.strokeColor = '#d3d3d3';
        paperPixel.fillColor = 'white';
      }
    }
  };

  // creates the grid
  drawGridRects(16, 16, paper.view.bounds);

  paper.view.onClick = function(event) {
    if (!pixelColor) {
      return;
    }
    let i = paper.project.hitTest(event.point).item.index;
    paper.project.activeLayer.children[i].fillColor = pixelColor;
  };

  // draws the view
  paper.view.draw();
};

const exportJSON = function(event) {
  event.preventDefault();

  let title = getFormFields(event.target).title;
  svg = paper.project.exportJSON({asString: true});

  let data = {
    "post": {
      "title": title,
      "content": svg
    }
  };

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

const getPosts = () => {
  api.indexPosts()
    .done(ui.displayPosts)
    .fail(ui.failure);
};

const getSinglePost = (event) => {
  event.preventDefault();

  let title = getFormFields(event.target).title;
  let id = $(`.title:contains(${title})`).data('id');

  api.showPost(id)
    .done(ui.displayPosts)
    .fail(ui.failure);
};

const addHandlers = () => {
  paperSetup();
  $('.exportSVG').on('submit', exportJSON);
  $('.importSVG').on('click', importJSON);
  $('.palette').on('click', getPaletteColor);
  $('.get-posts').on('click', getPosts);
  $('.get-single-post').on('submit', getSinglePost);
};

module.exports = {
  addHandlers,
};
