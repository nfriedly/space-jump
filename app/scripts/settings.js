(function(root) {
  'use strict';

  var Settings = {
    debug: false
  };

  document.getElementById('debug').onclick = function() {
    Settings.debug = !Settings.debug;
  };

  root.Settings = Settings;
}(this));
