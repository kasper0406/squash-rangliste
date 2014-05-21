define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var Backbone = require("backbone");
  var app = require("app");

  var EditUserView = Backbone.View.extend({
    tagName: 'div',
    className: 'modal fade',
    template: _.template(require("text!templates/edit-user.html")),

    saveFailed: $('<div class="bs-callout bs-callout-danger"><h4>Oplysningerne kunne ikke gemmes</h4><p /></div>'),

    events: {
      "hidden.bs.modal": "teardown",
      'click button.btn-primary': 'save'
    },

    initialize: function() {
      this.listenTo(this.model, "invalid", function(model, error) {
        this.saveFailed.detach();

        this.saveFailed.find("p").html(error);
        this.$('div.modal-body').prepend(this.saveFailed);
        this.saveFailed.hide().show('highlight');
      });

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

    save: function(evt) {
      var self = this;

      evt.preventDefault();
      this.saveFailed.detach();

      // var name = this.$('input[name="name"]').val();
      var email = this.$('input[name="email"]').val();
      var phone = this.$('input[name="phone"]').val();

      var password = this.$('input[name="password"]').val();
      var password_repeat = this.$('input[name="repeat-password"]').val();
      if (password.length !== 0 || password_repeat.length !== 0) {
        if (!this.model.setNewPassword(password, password_repeat))
          return;
      }

      this.model.save({
        // "name": name,
        "email": email,
        "phone": phone
      }, {
        success: function(model, response) {
          self.$el.modal('hide');
        },

        error: function(model, response) {
          self.saveFailed.find("p").html(response);
          self.$('div.modal-body').prepend(self.saveFailed);
          self.saveFailed.hide().show('highlight');
        }
      });
    }
  });

  return EditUserView;
});
