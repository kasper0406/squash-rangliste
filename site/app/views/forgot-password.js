define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var Backbone = require("backbone");
  var app = require("app");

  var ForgotPasswordView = Backbone.View.extend({
    tagName: 'div',
    className: 'modal fade',
    template: _.template(require("text!templates/forgot-password.html")),

    failed: $('<div class="bs-callout bs-callout-danger"><h4>Ugyldigt medlems nr.</h4><p /></div>'),
    success: $('<div class="bs-callout bs-callout-info"><h4>Nyt kodeord afsendt</h4><p>Der er afstendt en e-mail til dig med et nyt kodeord.</p></div>')

    events: {
      "hidden.bs.modal": "teardown",
      "click .request-new-password": "requestNewPassword"
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
      this.$el.html(this.template(this.model.toJSON()));

      this.$el.modal({show: false});
      return this;
    },

    requestNewPassword: function(evt) {
      var self = this;

      evt.preventDefault();
      this.failed.detach();

      var member_id = this.$('input[name="member_id"]').val();
      
    }
  });

  return ForgotPasswordView;
});
