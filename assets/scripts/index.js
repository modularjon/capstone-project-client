'use strict';

const paper = require('paper');
const paperSetup = require('./paper/paper-setup');
const authEvents = require('./auth/auth-events');

$(() => {
  paper.install(window);
  paperSetup.addHandlers();
  authEvents.addHandlers();
});
