(function(root) {
  'use strict';

  var Settings = {
    debug: false
  };

  Object.keys(Settings).forEach(function(key) {
    document.getElementById(key).onclick = function() {
      Settings[key] = !Settings[key];
    };
  });

  root.Settings = Settings;
}(this));
