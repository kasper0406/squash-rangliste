define(function(require, exports, module) {
  "use strict";

  var Utils = {
    getDate: function(mysqlDate) {
      var datePart = mysqlDate.split(' ')[0];
      var parts = datePart.split('-');

      var year = parts[0];
      var month = parts[1];
      var day = parts[2];

      return new Date(year, month - 1, day);
    },

    formatDate: function(mysqlDate) {
      var date = this.getDate(mysqlDate);
      return date.getDate() + " / " + (date.getMonth() + 1) + " / " + date.getFullYear();
    }
  };

  return Utils;
});