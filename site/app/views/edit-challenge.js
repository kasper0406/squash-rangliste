define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var Backbone = require("backbone");
  var app = require("app");
  var EditScoresView = require('views/edit-scores');

  var EditChallengeView = Backbone.View.extend({
    tagName: 'div',
    className: 'modal fade',
    template: _.template(require("text!templates/edit-challenge.html")),

    invalidScoreNotification: $('<div class="failed">Ugyldigt resultat indtastet: <span />.</div>'),
    saveFailed: $('<div class="failed">Ændring af kampresultatet lykkedes ikke!</div>'),

    events: {
      "hidden.bs.modal": "teardown",
      'click div.choose-box': 'selectBox',
      'click button.btn-primary': 'save'
    },

    initialize: function() {
      this.listenTo(this.model.challenge, "invalid", function() {
        $(this.invalidScoreNotification.find("span")).text(this.model.challenge.validationError);
        this.$('div.modal-body').prepend(this.invalidScoreNotification);
        this.invalidScoreNotification.hide().show("highlight");
      });

      this.editScoresView = new EditScoresView({ model: this.model.challenge });

      _(this).bindAll();
      $("body").append(this.$el);
      this.render();
    },

    show: function() {
      this.$el.modal('show');
    },

    teardown: function() {
      this.$el.data('modal', null);
      this.remove();
    },

    render: function() {
      var templateArgs = this.model;
      templateArgs.matchPlayed = templateArgs.winner !== null && templateArgs.score.challenger[1] !== null;
      this.$el.html(this.template(templateArgs));

      this.$('div.with-result div.body').append(this.editScoresView.render().$el);

      this.$el.modal({show: false});
      return this;
    },

    selectBox: function(evt) {
      this.$('div.choose-box').removeClass('active');
      $(evt.currentTarget).addClass('active');
      $(evt.currentTarget).find('input[name="result-type"]').prop('checked', true);
    },

    save: function(evt) {
      var self = this;

      evt.preventDefault();
      this.invalidScoreNotification.detach();
      this.saveFailed.detach();

      var scores = null;
      var winner = null;

      if (this.$('input[name="result-type"]:checked').val() === "with-result") {
        scores = this.editScoresView.collectScores();
      } else {
        winner = this.$('select[name="winner"]').val();
      }

      this.model.challenge.save({
        "scores": scores,
        "winner": winner
      }, {
        wait: true,
        url: '/backend/challenge/' + this.model.id,
        success: function(model, response) {
          app.ranking.fetch({ reset: true });
          self.$el.modal('hide');

          if (response.manualRankUpdateRequired) {
            alert("Systemet har endnu ikke support for automatisk opdatering af ranglisten ved resultatændringer af kampe. En manuel flytning af personen på ranglisten er påkrævet.");
          }
        },

        error: function() {
          self.$('div.modal-body').prepend(self.saveFailed);
          self.saveFailed.hide().show('highlight');
        }
      });
    }
  });

  return EditChallengeView;
});
