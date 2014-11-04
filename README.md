backbone-tictactoe
==================

Let's play some Tic Tac Toe

This is just an example app that I built for fun.

Tools used:
  * Backbone.js
  * RequireJS
  * Bootstrap 3 (Just the responsive grid, Typography, and Buttons)
  * jQuery
  * Underscore.js

**Note:** Normally, I would put the markup templates in separate template files, and then use requireJS's text.js to import them in. However, Chrome complains about CORS issues when importing the template files that way when running locally. Since this is an example app meant to be run locally, I'll leave the templates inline in the index.html file.
