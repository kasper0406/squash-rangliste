// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
  paths: {
    // Make vendor easier to access.
    "vendor": "../vendor",

    // Almond is used to lighten the output filesize.
    "almond": "../vendor/bower/almond/almond",

    // Opt for Lo-Dash Underscore compatibility build over Underscore.
    "underscore": "../vendor/bower/lodash/dist/lodash.underscore",

    // Map remaining vendor dependencies.
    "jquery": "../vendor/bower/jquery/jquery",
    "jquery-ui": "../vendor/bower/jquery-ui/ui/jquery-ui",
    "backbone": "../vendor/bower/backbone/backbone",

    "bootstrap": "../vendor/bower/bootstrap/dist/js/bootstrap.min",
    "text": "../vendor/bower/requirejs-text/text",

    "cryptojs-sha3": "../vendor/bower/crypto-js/sha3"
  },

  shim: {
    // This is required to ensure Backbone works as expected within the AMD
    // environment.
    "backbone": {
      // These are the two hard dependencies that will be loaded first.
      deps: ["jquery", "underscore"],

      // This maps the global `Backbone` object to `require("backbone")`.
      exports: "Backbone"
    }
  }
});