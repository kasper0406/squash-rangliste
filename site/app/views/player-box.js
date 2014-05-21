define(function(require, exports, module) {
  var Backbone = require("backbone");
  var app = require("app");

  var PlayerBoxView = Backbone.View.extend({
    tagName: 'div',
    className: 'player btn',

    events: function() {
      var self = this;

      if (app.authenticationStatus.get("authenticated")) {
        return {
          "click": function() {
            var Player = require("views/player");
            var playerModal = new Player({ model: self.model });
            playerModal.show();
          }
        };
      }
    },

    render: function() {
      if (app.authenticationStatus.get("authenticated")) {
        this.$el.addClass("clickable");

        if (this.model.get('challengable') !== undefined && this.model.get('challengable').is) {
          this.$el.addClass("challengable");
        }

        if (this.model.get("challengable") !== undefined && this.model.get("challengable").reason === "PENDING_CHALLENGE") {
          this.$el.addClass("pending-challenge");
        }
      }

      var outer = $('<div class="outer" />');
      outer.append($('<span class="badge" />').text(this.model.get('rank')));
      outer.append($('<div class="name" />').text(this.model.get('name')));
      this.$el.append(outer);
      return this;
    }
  });

  return PlayerBoxView;
});
