define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var Backbone = require("backbone");
  var app = require("app");

  var EditDescriptionView = Backbone.View.extend({
    tagName: 'div',
    className: 'modal fade',
    template: _.template(require("text!templates/edit-description.html")),

    saveFailed: $('<div class="bs-callout bs-callout-danger"><h4>Beskrivelsen blev ikke gemt</h4><p /></div>'),

    events: {
      "hidden.bs.modal": "teardown",
      'click button.btn-primary': 'save'
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

    save: function(evt) {
      var self = this;

      evt.preventDefault();
      this.saveFailed.detach();

      var description = this.$('textarea[name="description"]').val();

      this.model.save({
        "description": description,
      }, {
        wait: true,
        url: '/backend/description',
        success: function(model, response) {
          self.$el.modal('hide');
        },

        error: function() {
          self.$('div.modal-body').prepend(self.saveFailed);
          self.saveFailed.find("p").html(response);
          self.saveFailed.hide().show('highlight');
        }
      });
    }
  });

  return EditDescriptionView;
});
