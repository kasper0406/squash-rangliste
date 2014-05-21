define(function(require, exports, module) {
  "use strict";

  var Challenge = require('models/challenge');

  var LatestChallenges = Backbone.Collection.extend({
    model: Challenge,
    url: '/backend/challenge/latest',

    initialize: function() {
    }
  });

  return LatestChallenges;
});
