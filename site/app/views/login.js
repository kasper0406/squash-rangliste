define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");

  var LoginView = Backbone.View.extend({
    tag: 'div',
    template: _.template(require("text!templates/login.html")),

    initialize: function() {
      this.listenTo(app.authenticationStatus, "auth:failed", this.loginFailed);
    },

    events: {
      'submit form': 'doLogin',
      'keyUp': 'keyListener',
      'click .forgot-password': 'forgotPassword'
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    keyListener: function(event) {
      var ENTER_KEY = 13;
      if (event.which == ENTER_KEY)
        doLogin(event);
    },

    doLogin: function(event) {
      event.preventDefault();
      this.$('.submit-button').button('loading');

      var user_id = this.$('input[name="user_id"]').val().trim();
      var password = this.$('input[name="password"]').val().trim();
      app.authenticationStatus.authenticate(user_id, password);
    },

    loginFailed: function() {
      this.$('.submit-button').button('reset');

      var failNotification = this.$("div.bs-callout");
      if (failNotification.length === 0) {
        failNotification = $('<div class="bs-callout bs-callout-danger"><h4>Login lykkedes ikke</h4><p>Der er angivet en ugyldigt medlemsnummer eller adgangskode. <a href="#" class="forgot-password">Klik her</a> hvis du har glemt din adgangskode.</p></div>');
        this.$("div.panel-body").prepend(failNotification);
      }
      failNotification.hide().show("highlight");
    },

    forgotPassword: function(evt) {
      evt.preventDefault();

      var ForgotPasswordView = require("views/forgot-password");
      new ForgotPasswordView().render().show();
    }
  });

  return LoginView;
});