'use strict';

const app = require('../app.js');
const paper = require('paper');

const success = (data) => {
  if (data) {
    console.log(data);
  } else {
    console.log('Success');
  }
};

const failure = (error) => {
  console.error(error);
};

const displayPosts = function(posts){
  $('.feed').html('');
  let postListingTemplate = require('../templates/post-listing.handlebars');
  $('.feed').append(postListingTemplate(posts));
  console.log(posts);
  posts.posts.forEach((post) => {

    paper.setup(`feed-canvas-${post.id}`);

    paper.project.clear();
    let canvasDimension = 256;
    paper.view.viewSize = (canvasDimension, canvasDimension);

    paper.project.importJSON($(`#feed-canvas-${post.id}`).data('content'));
  });

  paper.projects[0].activate();
};

module.exports = {
  success,
  failure,
  displayPosts,
};
