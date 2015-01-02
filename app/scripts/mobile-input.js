/* exported: MobileInput */
/* globals Canvas, Util */
(function(root){
  'use strict';

  var MobileInput = {};

  var inputMap = MobileInput.inputMap = {
    up: 0,
    left: 0,
    right: 0
  };

  Canvas.addEventListener('touchstart', function() {
    inputMap.up = 1;
  }, true);
  Canvas.addEventListener('touchend', function() {
    inputMap.up = 0;
  }, true);

  window.addEventListener('deviceorientation', function(e) {
    var val = Util.mapValue(Math.abs(e.gamma), 0, 40, 0, 1); // devices actually go up to 90 or 180 depending on the browser.. but I'm going to count anything above 40 as "max"
    val = Math.min(1, val);
    if (e.gamma > 0) {
      inputMap.left = 0;
      inputMap.right = val;
    } else {
      inputMap.left = val;
      inputMap.right = 0;
    }
  }, true);

  root.MobileInput = MobileInput;
}(this));
