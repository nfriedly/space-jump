/* exported: background */
/* globals Canvas, Platforms */

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

    var offset = Canvas.getOffset() / (Platforms.GAME_HEIGHT+20) * bg.height;
    ctx.drawImage(bg, 0, Canvas.height - bg.height + offset);
  };

  root.Background = Background;

}(this));

