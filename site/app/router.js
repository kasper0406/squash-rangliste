define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  var MainView = require("views/main");
  var app = require('app');

  // Defining the application router.
  module.exports = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
      new MainView();
    }
  });
});