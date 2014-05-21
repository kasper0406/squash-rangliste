define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");

  var Challenge = Backbone.View.extend({
    tagName: "div",
    className: "challenge",
    template: _.template(require("text!templates/challenge.html")),

    initialize: function(options) {
    },

    events: {
      "click a.edit": "edit"
    },

    render: function() {
      var args = this.model;
      if (this.model.winner === this.model.challengee.member_id) {
        args.winner = this.model.challengee;
      } else {
        args.winner = this.model.challenger;
      }
      args.isAdmin = app.authenticationStatus.get("admin") === true;

      this.$el.html(this.template(args));
      return this;
    },

    edit: function(evt) {
      evt.preventDefault();

      var EditChallengeView = require("views/edit-challenge");
      new EditChallengeView({ model: this.model }).show();
    }
  });

  return Challenge;
});