'use strict';

const paper = require('paper');
const getFormFields = require('../../../lib/get-form-fields');

const api = require('./paper-api');
const ui = require('./paper-ui');

// variable to hold chosen palette color
let pixelColor;

// variable to hold exported svg
let content;

const onPaperSetup = () => {
  // Get reference to canvas object:
  // let canvas = document.getElementById('myCanvas');
  // Create empty project and view for the canvas:
  paper.setup('drawing');

  // set canvas to 256 x 256 pixels
  let canvasDimension = 256;

  paper.view.viewSize = (canvasDimension, canvasDimension);

  // define the grid
  const drawGridRects = function(gridWidth, gridHeight, canvasSize) {
    let widthPixels = canvasSize.width / gridWidth;
    let heightPixels = canvasSize.height / gridHeight;
    for (let i = 0; i < gridWidth; i++) {
      for (let j = 0; j < gridHeight; j++) {
        let paperPixel = new paper.Path.Circle(canvasSize.left + (i + 0.5) * widthPixels, canvasSize.top + (j + 0.5) * heightPixels, widthPixels/2);//, heightPixels);
        paperPixel.strokeColor = '#a6a6a6';
        paperPixel.fillColor = 'white';
      }
    }
  };

  // creates the grid
  drawGridRects(16, 16, paper.view.bounds);

  // function to change fillColor of drawing canvas items
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

const onGetPaletteColor = function(event) {
  pixelColor = $(event.target).css('background-color');
};

const onGetAllPosts = (event) => {
  event.preventDefault();

  api.indexPosts()
    .done(ui.displayPosts)
    .fail(ui.failure);
};

const onGetSinglePost = (event) => {
  event.preventDefault();

  let title = getFormFields(event.target).title;
  let id = $(`.title:contains(${title})`).data('id');

  api.showPost(id)
    .done(ui.displayPosts)
    .fail(ui.failure);
};

const onCreatePost = function(event) {
  event.preventDefault();

  let title = getFormFields(event.target).title;
  content = paper.project.exportJSON({asString: true});

  let data = {
    "post": {
      "title": title,
      "content": content
    }
  };

  api.createPost(data)
    .then(ui.success)
    .then(api.indexPosts)
    .then(ui.displayPosts)
    .catch(ui.failure);
};

const onMoveToCanvas = (event) => {
  event.preventDefault();

  let id = $(event.target).data('id');
  let content = $(`#feed-canvas-${id}`).data('content');
  paper.projects[0].importJSON(content);
  $('#drawing').data('id', id);
  $('#drawing').data('content', content);
};

const onUpdatePost = (event) => {
  event.preventDefault();

  let id = $('#drawing').data('id');
  let content = paper.project.exportJSON({asString: true});

  let data = {
    "post": {
      "content": content
    }
  };

  api.updatePost(id, data)
    .then(ui.success)
    .then(api.indexPosts)
    .then(ui.displayPosts)
    .catch(ui.failure);
};

const onDeletePost = (event) => {
  event.preventDefault();

  let id = $(event.target).data('id');

  api.deletePost(id)
    .done(ui.deleteSuccess(id))
    .fail(ui.failure);
};

const addHandlers = () => {
  onPaperSetup();
  $('.palette-item').on('click', onGetPaletteColor);
  $('.get-posts').on('click', onGetAllPosts);
  $('.get-single-post').on('submit', onGetSinglePost);
  $('.create-post').on('submit', onCreatePost);
  $(document).on('click', '.move-to-canvas', onMoveToCanvas);
  $('.update-post').on('click', onUpdatePost);
  $(document).on('click', '.delete-post', onDeletePost);
};

module.exports = {
  addHandlers,
};
