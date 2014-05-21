define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var _ = require("underscore");
  var $ = require("jquery");
  var Backbone = require("backbone");
  var AuthenticationStatus = require("models/authentication-status");
  var Challenge = require("models/challenge");
  var Ranking = require('models/ranking');

  // Alias the module for easier identification.
  var app = module.exports;

  // The root path to run the application through.
  app.root = "/";

  app.authenticationStatus = new AuthenticationStatus();
  app.ranking = new Ranking();
  app.currentChallenge = new Challenge(null, { url: '/backend/challenge/current' });

  app.authenticationStatus.on("change:authenticated", function() {
    app.currentChallenge.clear();
    if (app.authenticationStatus.get("authenticated")) {
      app.currentChallenge.fetch();
    }
  });
});