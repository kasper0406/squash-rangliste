define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");

  var RankingView = Backbone.View.extend({
    template: _.template(require("text!templates/ranking.html")),

    initialize: function() {
      this.listenTo(app.ranking, 'sync change', _.debounce(this.render));
      this.listenTo(app.currentChallenge, 'sync', function() {
        app.ranking.fetch({ reset: true });
      });

      app.ranking.fetch({ reset: true });
    },

    render: function() {
      this.addedPlayers = 0;
      this.columns = 0;
      this.playersInCurrentColumn = 0;

      this.renderedTemplate = $(this.template());
      app.ranking.each(this.addPlayer, this);

      this.$el.html(this.renderedTemplate);

      return this;
    },

    addPlayer: function(player) {
      var rankview = this.renderedTemplate.find("#rankview");

      if (this.playersInCurrentColumn >= this.columns) {
        this.columns++;
        this.playersInCurrentColumn = 0;

        // The current column is full, start a new one!
        this.currentColumn = $('<div class="column" />');
        rankview.prepend(this.currentColumn);
      }

      this.playersInCurrentColumn++;
      this.addedPlayers++;

      var PlayerBoxView = require('views/player-box');
      this.currentColumn.append(new PlayerBoxView({ model: player }).render().el);
    },

    isInteger: function(a) {
      return typeof(a) === "number" && a % 1 === 0;
    }

  });

  return RankingView;

});