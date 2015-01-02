/* exported: Util */

(function(root) {
  'use strict';

  var Util = {};

  Util.mapValue = function (value, fromLow, fromHigh, toLow, toHigh) {
    return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow;
  };

  Util.mapToArray = function (value, fromLow, fromHigh, array) {
    // the +1 is to ensure we never hit array.length (because the last item is at array.length -1)
    return array[Math.floor(Util.mapValue(value, fromLow, fromHigh + 1, 0, array.length))];
  };

  root.Util = Util;
}(this));
