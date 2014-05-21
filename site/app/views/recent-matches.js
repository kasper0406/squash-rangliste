define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");
  var LatestChallenges = require("models/latest-challenges");

  var RecentMatches = Backbone.View.extend({
    tag: 'div',
    template: _.template(require("text!templates/recent-matches.html")),
    challengeTemplate: _.template(require("text!templates/challenge.html")),

    initialize: function(options) {
      this.$el.html(this.template());
      this.$("div.matches").html($('<p class="info">Loading...</p>'));

      var challengesFetchArgs = { };
      if (options !== undefined && options.player !== undefined) {
        this.player = options.player;
        challengesFetchArgs.player = this.player.get("member_id");
        if (this.player.get('member_id') === app.authenticationStatus.get("member_id")) {
          this.$(".panel-title").text("Mine kampe");
        } else {
          this.$(".panel-title").text("Seneste kampe");
        }
      } else {
        this.player = null;
        this.$(".panel-title").text("Seneste kampe");
      }

      this.challenges = new LatestChallenges();
      this.listenTo(this.challenges, 'sync', _.debounce(this.render));
      this.listenTo(app.currentChallenge, 'sync', function() {
        this.challenges.fetch({ data: challengesFetchArgs, reset: true });
      });
      this.listenTo(app.ranking, 'all', function() {
        this.challenges.fetch({ data: challengesFetchArgs, reset: true });
      });

      this.challenges.fetch({ data: challengesFetchArgs, reset: true });
    },

    render: function() {
      var content = $('<div class="matches" />');
      if (this.challenges.length === 0) {
        content.append($("<p>Der er ingen kampe at vise.</p>").addClass("info"));
      } else {
        this.challenges.each(function(challenge) {
          var args = challenge.toJSON();
          args.challenge = challenge;
          args.player = this.player;

          var Challenge = require("views/challenge");
          content.append(new Challenge({ model: args }).render().$el);
        }, this);
      }

      this.$("div.matches").replaceWith(content);

      return this;
    }
  });

  return RecentMatches;
});