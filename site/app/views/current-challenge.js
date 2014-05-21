define(function(require, exports, module) {
  var Backbone = require("backbone");
  var app = require("app");
  var EditScoresView = require('views/edit-scores');

  var CurrentChallengeView = Backbone.View.extend({
    tagName: 'form',

    template: _.template(require("text!templates/current-challenge.html")),
    invalidScoreNotification: $('<div class="bs-callout bs-callout-danger"><h4>Ugyldigt resultat!</h4><p /></div>'),
    reportFailed: $('<div class="failed">Indrapporteringen lykkedes ikke!</div>'),

    events: {
      "submit": 'reportScores',
      'keyUp': 'keyListener'
    },

    initialize: function() {
      this.listenTo(app.currentChallenge, "sync", _.debounce(this.render));
      this.listenTo(app.currentChallenge, "invalid", function() {
        $(this.invalidScoreNotification.find("p")).text(app.currentChallenge.validationError);
        this.invalidScoreNotification.insertBefore(this.$('table.scores'));
        this.invalidScoreNotification.hide().show("highlight");
      });

      this.editScoresView = new EditScoresView({ model: app.currentChallenge });
    },

    render: function() {
      if (app.currentChallenge.get("id") === undefined) {
        this.$el.html("");
        return this;
      }

      var viewData = app.currentChallenge.toJSON();
      viewData.Utils = require('utils');
      viewData.challenge = app.currentChallenge;
      this.$el.html(this.template(viewData));

      this.$("table.scores").replaceWith(this.editScoresView.render().$el);

      return this;
    },

    keyListener: function(event) {
      var ENTER_KEY = 13;
      if (event.which == ENTER_KEY)
        reportScores(event);
    },

    reportScores: function(event) {
      var self = this;

      event.preventDefault();
      this.invalidScoreNotification.detach();

      app.currentChallenge.set("scores", this.editScoresView.collectScores());
      app.currentChallenge.save({}, {
        success: function() {
          app.currentChallenge.clear();
          app.currentChallenge.trigger("sync");
        },

        error: function() {
          self.reportFailed.detach();
          self.$('div.challenge').prepend(self.reportFailed);
          self.reportFailed.hide().show('highlight');
        }
      });
    }
  });

  return CurrentChallengeView;
});
