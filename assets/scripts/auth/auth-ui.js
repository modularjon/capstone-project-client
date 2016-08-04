'use strict';

const app = require('../app.js');

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

const signUpSuccess = function() {
  // $('.signed-in').text("Signed up!");
  // $('form').trigger('reset');
};

const signInSuccess = (data) => {
  app.user = data.user;
  $('.sign-up').hide();
  $('.sign-in').hide();
  $('.sign-out').show();
  $('.change-password').show();
  $('.get-posts').show();
  $('.signed-in').text('Signed in as: ' + app.user.email);
  $('form').trigger('reset');
};

const signOutSuccess = () => {
  app.user = null;
  $('.feed').html('');
  $('.get-posts').hide();
  $('.get-single-post').hide();
  $('.change-password').hide();
  $('.sign-out').hide();
  $('.sign-up').show();
  $('.sign-in').show();
  $('.signed-in').text('Sign in to start!');
};

const changePasswordSuccess = function() {
  $('.signed-in').text("Password changed successfully!");
  $('form').trigger('reset');
};

module.exports = {
  success,
  failure,
  signUpSuccess,
  signInSuccess,
  signOutSuccess,
  changePasswordSuccess
};
