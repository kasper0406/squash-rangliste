define(function(require, exports, module) {
  "use strict";

  var Backbone = require("backbone");

  var Description = Backbone.Model.extend({
    url: '/backend/description',

    defaults: {
      description: 'Loading...'
    }
  });

  return Description;

});
