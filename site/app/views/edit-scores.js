define(function(require, exports, module) {
  var Backbone = require("backbone");
  var app = require("app");

  var EditScoresView = Backbone.View.extend({
    tagName: 'table',
    className: 'scores',

    template: _.template(require("text!templates/edit-scores.html")),

    events: {
      "change input": function(event) {
        // Correct user inputs
        var input = $(event.currentTarget);

        var correctedVal = parseInt(input.val(), 10);
        if (isNaN(correctedVal))
          correctedVal = '';

        input.val(correctedVal);
      }
    },

    initialize: function() {
    },

    render: function() {
      var viewData = this.model.toJSON();
      viewData.challenge = this.model;

      this.$el.html(this.template(viewData));
      return this;
    },

    collectScores: function() {
      var scores = { };
      scores.challenger = { };
      scores.challengee = { };

      var convert = function(val) {
        if (val === '' || isNaN(val)) return null;
        else return parseInt(val, 10);
      };

      for (var set = 1; set <= app.currentChallenge.bestOf; set++) {
        scores.challenger[set] = convert(this.$('input[name="challenger_set[' + set + ']"]').val());
        scores.challengee[set] = convert(this.$('input[name="challengee_set[' + set + ']"]').val());
      }

      return scores;
    }
  });

  return EditScoresView;
});
