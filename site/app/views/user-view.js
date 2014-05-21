define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");

  var UserView = Backbone.View.extend({
    tag: 'div',
    template: _.template(require('text!templates/user-view.html')),

    initialize: function() {

    },

    events: {
      "click button.logout": "logout",
      "click button.edit-user": "editUser"
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    logout: function(evt) {
      evt.preventDefault();
      app.authenticationStatus.logout();
    },

    editUser: function(evt) {
      evt.preventDefault();
      var EditUserView = require("views/edit-user");
      new EditUserView({ model: app.authenticationStatus.getPlayer() }).render().show();
    }
  });

  return UserView;
});