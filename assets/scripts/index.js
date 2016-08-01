'use strict';

const paperSetup = require('./paper/paper-setup');
const paper = require('paper');

$(() => {
  paper.install(window);
  paperSetup.addHandlers();
  authEvents.addHandlers();
});
