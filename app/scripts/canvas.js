/* exported: Canvas */
/* globals Background, Player, Settings, Platforms, Player, MobileInput */

(function (root) {
  'use strict';


  var Canvas = document.getElementById('game-window');

  var ctx = Canvas.getContext('2d');

// this should return 0 at game start
// todo: consider letting the player move up/down the canvas a little based on velocity
  Canvas.getOffset = function () {
    return Player.y - Canvas.height / 2;
  };

// The game calculates y coordinates starting at the bottom and going up (so that it can add content at the top)
// the canvas element calculates y coordinates starting at the top-left and going down
// this function translates from game y to canvas y based on the player's position.
  Canvas.mapY = function (gameY, height, offset) {
    height = height || 0;
    offset = offset || Canvas.getOffset();
    return Canvas.height - (gameY - offset) - height;
  };


  var lastFrameTime = Date.now();

  function drawDebug() {

    // calculate framerate
    var now = Date.now();
    var fps = Math.round(100000 / (now - lastFrameTime)) / 100;
    lastFrameTime = now;

    var headPad = 5;
    var sidePad = 5;
    var lineHeight = 14;
    var lines = Object.keys(Player).filter(function(key) {
      return typeof Player[key] !== 'function';
    }).map(function (key) {
      return key + ': ' + Player[key];
    }).concat([
      'offset: ' + Canvas.getOffset(),
      'platforms: ' + Platforms.getVisiblePlatforms().length + '/' + Platforms.length,
      'fps: ' + fps,
      '% complete: ' + Math.round(Canvas.getOffset() / Platforms.GAME_HEIGHT * 10000) / 100
    ]).concat(
      Object.keys(MobileInput.inputMap).map(function (key) {
        return 'Mobile ' + key + ': ' + MobileInput.inputMap[key];
      })
    );


    ctx.font = '10pt Helvetica';
    ctx.textBaseline = 'top';

    var width = lines.reduce(function (curWidth, str) {
      return Math.max(curWidth, ctx.measureText(str).width);
    }, 0);

    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, width + sidePad * 2, (lines.length) * lineHeight + headPad * 2);

    ctx.fillStyle = 'lime';
    lines.forEach(function (line, offset) {
      ctx.fillText(line, sidePad, offset * lineHeight + headPad);
    });
  }

  Canvas.drawDialog = function (text, background) {
    ctx.font = '20px Helvetica';
    ctx.textBaseline = 'top';
    var padding = 10;
    var width = ctx.measureText(text).width + padding * 2;
    var height = 40;
    var left = Canvas.width / 2 - width / 2;
    var top = Canvas.height / 2 - height / 2;
    ctx.fillStyle = background || 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(left, top, width, height);
    ctx.fillStyle = 'white';
    ctx.fillText(text, left + padding, top + padding);
  };

  function clear() {
    ctx.clearRect(0, 0, Canvas.width, Canvas.height);
  }


  Canvas.render = function () {
    if (!Background.image.loaded) {
      clear();
    } else {
      Background.draw(ctx);
    }
    Platforms.draw(ctx);
    Player.draw(ctx);
    if (Settings.debug) {
      drawDebug();
    }
  };

  root.Canvas = Canvas;

}(this));
