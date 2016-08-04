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

const displayPosts = (data) => {
  $('form').trigger('reset');
  $('.get-single-post').show();

  if (data.post) {
    $('.get-single-post').hide();
    data.posts = [data.post];
  }

  app.posts = data.posts;

  paper.projects.forEach((project, i) => {
    if (i !== 0) {
      project.remove();
    }
  });

  $('.feed').html('');
  let postListingTemplate = require('../templates/post-listing.handlebars');
  $('.feed').append(postListingTemplate(data));

  data.posts.forEach((post) => {

    paper.setup(`feed-canvas-${post.id}`);

    paper.project.clear();
    let canvasDimension = 256;
    paper.view.viewSize = (canvasDimension, canvasDimension);

    paper.project.importJSON($(`#feed-canvas-${post.id}`).data('content'));
  });

  paper.projects[0].activate();
};

const deleteSuccess = (data) => {

  paper.projects.forEach((project) => {
    console.log(project._view._id);

    if (project._view._id === `feed-canvas-${data}`) {
      project.remove();
    }
  });

  $(`.post[data-id="${data}"]`).remove();
};

module.exports = {
  success,
  failure,
  displayPosts,
  deleteSuccess,
};
