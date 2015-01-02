/* exported: background */
/* globals Canvas, Platforms, Player */

(function(root) {
  'use strict';

  var Background = {};

  Background.image = new Image();
  Background.image.onload = function() {
    Background.image.loaded = true;
  };
  Background.image.src = 'images/PIA17843.jpg';


  Background.draw = function (ctx) {
    var bg = Background.image;

    // Canvas.height * 1.5 is because of an extra 0.5 at the bottom and 1 at the top (0.5 after the last platform + 0.5 above the player)
    var y = Util.mapValue(Player.y, 0,Platforms.GAME_HEIGHT, Canvas.height-bg.height, 0);
    ctx.drawImage(bg, 0, y);
  };

  root.Background = Background;

}(this));

