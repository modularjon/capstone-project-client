# DotMatrix

## Concept

People love drawing. We are visual creatures, and our language is as much visual
as it is verbal. Children begin drawing at a young age, and adults love visual
spectacle just as much. But a common problem with producing art is the
self-consciousness that it engenders. Very often people will prevent themselves
from creating because they cannot produce 'good' art. Typically they are
measuring themselves up against a standard work that takes lots of training and
hours of work to produce while not allowing themselves the same conditions.

So if one wanted to get people to draw more, what could you do? Many drawing
applications try to mimic the complexity of art produced in the 'analogue'
world, but I think that there is a simple method that many children's games take
advantage of to engage their users. Think of Lite-Brite. By restricting the
maximum available information content of the output, they allow people to more
freely express themselves without having to worry about an expert coming by and
making them feel inferior about their work. One could even make the case that
Twitter does this for language.

My goal in the creation of this application is to allow users to create quick,
fun, small drawings, share them with other users, create their own variations on
existing drawings, and comment on drawings, possibly with other drawings instead
of text content.

## Screencap of the application

  Screencap: [link](https://www.dropbox.com/s/d2oiunodvxwdsj9/Screenshot-2016-08-05-08.22.22.jpg?dl=0)

## Wireframes

  Smiley: [link](https://www.dropbox.com/s/x6ak2kqa99c0vlt/wireframe-1.jpg?dl=0)
  Main wireframe: [link](https://www.dropbox.com/s/afmv4uzncvn4ed6/wireframe-2.jpg?dl=0)

## Techs used

• HTML
• CSS
• JavaScript
• Paper.js
• JQuery
• AJAX
• Ruby
• Rails
• PostgreSQL

Paper.js is a library that allows you to configure canvas HTML element contents
to act in a simlar fashion to how they operate in Adobe Illustrator. A quick
introduction can be found
[here](https://github.com/modularjon/paperdotjs-presentation) and at their
[website](http://paperjs.org/). Install paper with `npm install paper`.

## Link to API

<https://github.com/modularjon/capstone-project-api>

## User Stories

  A user would like to:
    • Sign up by using any name they like and providing a password
    • Get confirmation of a successful sign up
    • Sign in using a previously registed name and password
    • Hide sign up/ sign in forms on sign in and show sign out/change password
    • Clear sign up, sign in and change password fields after use for security
    • Draw a 'pixellated' image on a drawing canvas
      - pick from multiple colors in a palette
      - give their drawing a unique title
      - submit the drawing for creation or update
      - add tags that descibe the content of their drawing
    • See all the drawings in the app in a feed
      - see all their own drawings
      - search by title to see one drawing
      - search by tags to see multiple drawings
      - see an indication of total items brought up by their search terms
    • Move a drawing from the feed to the canvas for editing
    • Comment on drawings

## Future Development

There are several directions that I would like to go in to alter the
application's current state.

1.  Allow drawing by dragging through cells, so that users may draw rapidly
1.  Incorporate bootstrap dismissable alerts to give users more feedback
1.  Finish the commenting and tags features
1.  Allow users to download any drawing as an .svg file
1.  Migrate the front-end to use Ember.js, to allow multiple view-states
