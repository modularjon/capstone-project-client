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
  return new Promise((resolve, reject) => {
    return $.ajax({
      url: app.host + '/posts',
      method: 'POST',
      data,
      headers: {
        Authorization: 'Token token=' + app.user.token,
      },
      success: (response) => {
        resolve(response);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

const deletePost = (data) => {
  return $.ajax({
    url: app.host + '/posts/' + data,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
  });
};

module.exports = {
  indexPosts,
  showPost,
  createPost,
  deletePost,
};
