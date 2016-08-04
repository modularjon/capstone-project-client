'use strict';

const paper = require('paper');
const paperEvents = require('./paper/paper-events');
const authEvents = require('./auth/auth-events');

$(() => {
  paper.install(window);
  paperEvents.addHandlers();
  authEvents.addHandlers();
});
