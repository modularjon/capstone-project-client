'use strict';

const paperSetup = () => {
  // Get reference to canvas object:
  // let canvas = document.getElementById('myCanvas');
  // Create empty project and view for the canvas:
  paper.setup('myCanvas');
  // Create a Paper.js Path to draw a line into it:
  let path = new Path();
  // Give the stroke a color:
  path.strokeColor = 'black';

  let start = new Point(100, 100);
  // Move to start and draw a line from there:
  path.moveTo(start);
  // Note the plus operator on Point objects.
  // PaperScript does that for us, and much more!

  // Note that the plus operator on Point objects does not work
	// in JavaScript. Instead, we need to call the add() function:
  path.lineTo(start.add([ 100, -50 ]));

  // Add a new point:
  // path.add(new Point(200, 200), new Point(150, 250));

  // Close the path:
  // path.closed = true;

  // Create a copy of the path:
  // path.fullySelected = true;
  // let copy = path.clone();

  // Move the copy over, then smooth it:
  // copy.fullySelected = true;
  // copy.position.x += 200;

  // Smooth the copy:
  // copy.smooth();

  // Draw the view now:
  view.draw();
};

const addHandlers = () => {
  paperSetup();
};

module.exports = {
  addHandlers,
};
