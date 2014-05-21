define(function(require, exports, module) {
  "use strict";

  var Backbone = require("backbone");

  var Challenge = Backbone.Model.extend({
    bestOf: 5,

    defaults: {
    },

    initialize: function() {
    },

    validate: function(attr) {
      var self = this;
      var scores = attr.scores;

      if (attr.scores === null) {
        if (attr.winner === null) {
          return "Udfordringen skal have en vinder";
        } else if (attr.winner !== attr.challenger.member_id && attr.winner !== attr.challengee.member_id) {
          // This is not okay. Winner is not specified correctly!
          return "Ugyldig vinder af kampen";
        } else {
          return; // This is okay. Winner is valid
        }
      }

      if (scores === undefined ||
          scores.challenger === undefined || scores.challengee === undefined) {
        return "Resultater er ikke specificeret";
      }

      var challengerWon = 0;
      var challengeeWon = 0;
      var winnerFound = function() {
        return challengerWon >= Math.ceil(self.bestOf / 2) ||
               challengeeWon >= Math.ceil(self.bestOf / 2);
      };
      for (var set = 1; set <= this.bestOf; set++) {
        var challengerScore = scores.challenger[set];
        var challengeeScore = scores.challengee[set];

        if (winnerFound()) {
          // Make sure the rest of the results are not set
          if (challengerScore !== null || challengeeScore !== null)
            return "Der er angivet resultater efter en vinder er fundet";
        } else {
          if (challengerScore === null || challengeeScore === null)
            return "Der er et tomt sæt før en vinder blev fundet";

          // Verify set scores
          var maxScore = Math.max(challengerScore, challengeeScore);
          var minScore = Math.min(challengerScore, challengeeScore);
          if (!((maxScore === 11 && maxScore - minScore >= 2) ||
                (maxScore >= 11 && maxScore - minScore === 2)) ||
              challengerScore < 0 || challengeeScore < 0 || challengerScore === challengeeScore) {
            return "Sæt " + set + " har et ugyldigt resultat";
          }

          // Find winner of the current set
          if (Math.max(challengerScore, challengeeScore) == challengerScore) {
            challengerWon++;
          } else {
            challengeeWon++;
          }
        }
      }

      if (!winnerFound())
        return "Der er ikke fundet en vinder af kampen";
    }
  });

  return Challenge;
});
