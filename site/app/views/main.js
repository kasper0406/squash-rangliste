define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");
  require("jquery-ui");
  require("bootstrap");

  var Ranking = require('views/ranking');
  var RecentMatchesView = require("views/recent-matches");
  var UserView = require('views/user-view');

  var Description = require('models/description');

  var MainView = Backbone.View.extend({
    el: "#main",
    template: _.template(require("text!templates/main.html")),

    initialize: function() {
      var self = this;

      // Check user status before showing UI
      this.$el.html("Loading...");
      app.authenticationStatus.fetch().complete(function() {
        app.authenticationStatus.on("change:authenticated", self.render, self);
        self.render();
      });

      this.description = new Description();
      this.listenTo(this.description, "sync", this.setDescription);
      this.description.fetch();
    },

    events: {
      "click a.edit-description": "editDescription"
    },

    setDescription: function() {
      this.$('div.description').html(this.description.get('description'));
    },

    editDescription: function(evt) {
      evt.preventDefault();

      var EditDescriptionView = require("views/edit-description");
      new EditDescriptionView({ model: this.description }).render().show();
    },

    render: function() {
      this.$el.html(this.template({ isAdmin: app.authenticationStatus.get("admin") }));
      this.setDescription();

      var rankingView = new Ranking({ el: this.$("#ranking") });

      var boxView = $('<div class="box-view" />');
      if (app.authenticationStatus.get("authenticated")) {
        // The user is signed in
        var CurrentChallengeView = require("views/current-challenge");

        boxView.append($('<div class="col-md-4" />').append(new CurrentChallengeView().render().el)
                                                    .append(new UserView().render().el));
        boxView.append(new RecentMatchesView({ player: app.authenticationStatus }).$el.addClass("col-md-4"));
        boxView.append(new RecentMatchesView().$el.addClass("col-md-4"));
      } else {
        // No user is signed in
        var LoginView = require("views/login");
        var SignupView = require("views/signup");

        boxView.append(new LoginView().render().$el.addClass("col-md-4"));
        boxView.append(new SignupView().render().$el.addClass("col-md-4"));
        boxView.append(new RecentMatchesView().$el.addClass("col-md-4"));
      }

      this.$("#user-area").append(boxView);
      return this;
    }
  });

  return MainView;
});
