define(function(require, exports, module) {
  "use strict";

  var Player = require('models/player');

  var Ranking = Backbone.Collection.extend({
    model: Player,
    url: '/backend/players'
  });

  return Ranking;
});