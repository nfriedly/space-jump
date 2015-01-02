/* exported: Player */
/* globals Input, Platforms, Util, Canvas*/
(function(root) {
  'use strict';
var PLAYER_WIDTH = 15;

var Player = {
  x: Platforms[0].x + Platforms[0].width / 2 - PLAYER_WIDTH / 2,
  y: 0,
  velocityX: 0,
  velocityY: 0,
  isOnPlatform: true,
  width: PLAYER_WIDTH
};


Player.draw = function (ctx) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  var x = Player.x;
  var y = Canvas.mapY(Player.y);

  // left wing
  ctx.moveTo(x+4, y-3);
  ctx.quadraticCurveTo(x-1,y-4,  x,y+2);
  ctx.bezierCurveTo(x,y-9, x+1,y-10, x+4,y-10);

  // left hull
  ctx.lineTo(x+4,y-25);

  // nose
  ctx.bezierCurveTo(x+4,y-27, x+5,y-30, x+7,y-30);
  ctx.bezierCurveTo(x+8,y-30, x+9,y-27,  x+10,y-27);

  // right hull
  ctx.lineTo(x+10, y-10);

  // right wing
  ctx.bezierCurveTo(x+13,y-9, x+14,y-10, x+14,y+2);
  ctx.quadraticCurveTo(x+15,y-4, x+10,y-3);

  ctx.fill();

  // window
  ctx.fillStyle = '#8888ff';
  ctx.beginPath();
  ctx.arc(x+7, y-26, 2, 0, Math.PI*2, false);
  ctx.fill();

  var ms = (new Date()).getMilliseconds();
  var flameExtras = [3, 5, 2, 7];
  var extra = Util.mapToArray(ms, 0, 999, flameExtras);


  var inputs = Input.getInputs();
  // bottom rocket
  if (inputs.up) {
    // red
    ctx.fillStyle = '#FF1D0E';
    ctx.beginPath();
    ctx.moveTo(x+4, y-2);
    ctx.lineTo(x+10, y-2);
    ctx.lineTo(x+7, y+9+extra);
    ctx.fill();

    // yellow
    ctx.fillStyle = '#FFDF0C';
    ctx.beginPath();
    ctx.moveTo(x+4, y-2);
    ctx.lineTo(x+10, y-2);
    ctx.lineTo(x+7, y+5+extra);
    ctx.fill();
  }

  // left rocket (lights up when right arrow is pressed)
  if (inputs.right > 0.1) {
    // red
    ctx.fillStyle = '#FF1D0E';
    ctx.beginPath();
    ctx.moveTo(x+4, y-20);
    ctx.lineTo(x+4, y-14);
    ctx.lineTo(x-3-extra*inputs.right, y-17);
    ctx.fill();

    // yellow
    ctx.fillStyle = '#FFDF0C';
    ctx.beginPath();
    ctx.moveTo(x+4, y-20);
    ctx.lineTo(x+4, y-14);
    ctx.lineTo(x-extra*inputs.right, y-17);
    ctx.fill();
  }

  // left rocket (lights up when right arrow is pressed)
  if (inputs.left > 0.1) {
    // red
    ctx.fillStyle = '#FF1D0E';
    ctx.beginPath();
    ctx.moveTo(x+10, y-20);
    ctx.lineTo(x+10, y-14);
    ctx.lineTo(x+17+extra*inputs.left, y-17);
    ctx.fill();

    // yellow
    ctx.fillStyle = '#FFDF0C';
    ctx.beginPath();
    ctx.moveTo(x+10, y-20);
    ctx.lineTo(x+10, y-14);
    ctx.lineTo(x+14+extra*inputs.left, y-17);
    ctx.fill();
  }

  // (top wing and l/r jets should always be on top of bottom rocket)
  // top wing
  ctx.beginPath();
  ctx.moveTo(x+7, y-10);
  ctx.lineTo(x+7, y);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x+4,y-17, 3, 0, Math.PI*2, false);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x+10,y-17, 3, 0, Math.PI*2, false);
  ctx.fill();
};

  root.Player = Player;

}(this));
