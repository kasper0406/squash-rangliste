define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var Backbone = require("backbone");
  var app = require("app");
  var RecentMatchesView = require("views/recent-matches");

  var PlayerView = Backbone.View.extend({
    tagName: 'div',
    className: 'modal fade',
    template: _.template(require("text!templates/player.html")),

    events: {
      "hidden.bs.modal": "teardown",
      'click button[name="challenge"]': "sendChallenge"
    },

    initialize: function() {
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
      var renderedTemplate = $(this.template(this.model.toJSON()));
      renderedTemplate.find("div.modal-body").append(new RecentMatchesView({ player: this.model }).el);

      this.$el.html(renderedTemplate);
      this.$el.modal({show: false});
      return this;
    },

    sendChallenge: function() {
      var waiting = $('<span>Anmoder om udfordring...</span>');
      this.$('button[name="challenge"]').replaceWith(waiting);

      $.post("/backend/player/challenge", {
        challengee: this.model.get("member_id")
      }).done(function(response) {
        if (response.accepted === true) {
          app.currentChallenge.fetch();
          waiting.text("Udfordringen er accepteret, og modstanderen er blevet kontaktet.");
        } else {
          waiting.text("Udfordringen blev ikke accepteret!");
        }
      }).fail(function() {
        waiting.text("Udfordringen blev ikke accepteret!");
      });
    }
  });

  return PlayerView;
});
