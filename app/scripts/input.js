/* exported: Input */
/* globals Keyboard, MobileInput */
(function(root){
  'use strict';

  var Input = {
    getInputs: function() {
      return {
        up: (Keyboard.inputMap.up ? 1 : 0) + MobileInput.inputMap.up,
        left: (Keyboard.inputMap.left ? 1 : 0) + MobileInput.inputMap.left,
        right: (Keyboard.inputMap.right ? 1 : 0) + MobileInput.inputMap.right
      };
    }
  };

  root.Input = Input;
}(this));
