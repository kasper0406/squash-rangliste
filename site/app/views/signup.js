define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");

  var SignupView = Backbone.View.extend({
    tag: 'div',
    template: _.template(require('text!templates/signup.html')),

    initialize: function() {

    },

    render: function() {
      this.$el.html(this.template());

      return this;
    }
  });

  return SignupView;
});