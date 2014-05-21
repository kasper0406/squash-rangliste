define(function(require, exports, module) {
  "use strict";

  var Backbone = require("backbone");

  var Player = Backbone.Model.extend({
    url: '/backend/player',
    idAttribute: "member_id",

    defaults: {
      name: 'Unknown'
    },

    setNewPassword: function(new_password, new_password_repeat) {
      var error = null;

      // Validate the new password
      var min_length = 4;
      if (new_password !== new_password_repeat) {
        error = "De indtastede adgangskoder er ikke ens";
      } else if (new_password.length < min_length) {
        error = "Adgangskoden skal mindst være 6 symbler langt";
      }

      if (error !== null) {
        this.trigger('invalid', this, error);
        return false;
      } else {
        require("cryptojs-sha3");
        this.set('user_salt', CryptoJS.SHA3(new_password + "FORZA_FCB" + new Date().toString() + "KEVIN_VINDER_F1" + Math.random().toString() + "CR7_TUDER").toString().toUpperCase());
        this.set('password', CryptoJS.SHA3(new_password + "KASPER_NIELSEN_VINDER_OVER_DIG" + this.get('user_salt')).toString().toUpperCase());
      }

      return true;
    }
  });

  return Player;

});
