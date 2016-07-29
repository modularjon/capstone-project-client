'use strict';

const paperSetup = require('./paper/paper-setup');

$(() => {
  paper.install(window);
  paperSetup.addHandlers();
});
