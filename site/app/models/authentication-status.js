define(function(require, exports, module) {
  "use strict";

  var Backbone = require("backbone");
  var app = require("app");

  var AuthenticationStatus = Backbone.Model.extend({
    url: '/backend/auth/currentuser',

    defaults: {
      authenticated: false
    },

    initialize: function() {
      
    },

    authenticate: function (member_id, password) {
      var self = this;
      var auth_failed = function() {
        self.trigger("auth:failed");
      };

      if (member_id.length === 0 || password.length === 0) {
        auth_failed();
        return;
      }

      $.getJSON("/backend/auth/salt/" + member_id)
        .done(function(salt) {
          if (salt === false) {
            // The user salt could not be retrieved!
            auth_failed();
            return;
          }

          require("cryptojs-sha3");
          $.post("/backend/auth/authenticate", {
            'user_id': member_id,
            'password': CryptoJS.SHA3(password + "KASPER_NIELSEN_VINDER_OVER_DIG" + salt).toString().toUpperCase()
          }).done(function(result) {
            if (result.authenticated === false) {
              auth_failed();
              return;
            }

            // WOHOOO!! We passed all the checks!
            self.clear();
            self.set(result);
          }).fail(auth_failed);
        })
        .fail(auth_failed);
    },

    logout: function() {
      var self = this;

      $.post("/backend/auth/logout")
        .done(function(result) {
          self.clear();
          self.set(result);
        })
        .fail(function() {
          console.error("Failed to log out!");
        });
    },

    getPlayer: function() {
      var Player = require('models/player');

      var player = app.ranking.get(this.get('member_id'));
      if (player !== undefined) {
        return player;
      } else {
        return new Player(this.toJSON());
      }
    }
  });

  return AuthenticationStatus;

});
