'use strict';

const app = require('../app.js');

const indexPosts = () => {
  return $.ajax({
    url: app.host + '/posts',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
  });
};

const showPost = (data) => {
  return $.ajax({
    url: app.host + '/posts/' + data,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
  });
};

const createPost = (data) => {
  return $.ajax({
    url: app.host + '/posts',
    method: 'POST',
    data,
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
  });
};

module.exports = {
  indexPosts,
  showPost,
  createPost,
};
