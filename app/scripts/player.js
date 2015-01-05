/* exported: Player */
/* globals Input, Platforms, Util, Canvas*/
(function (root) {
  'use strict';
  var PLAYER_WIDTH = 15;
  var FUEL_MAX = 40;
  var FUEL_BURN_RATE = 40;
  var FUEL_RECHARGE_RATE = 20; // per second
  var MIN_FUEL_TO_START_BURN = 2; // players fuel can drop below this if there were already burning, but they can't start a burn when below this
  var VELOCITY_MAX = 10; // pixels per second
  var ACCELERATION = 10; // pps/keypress
  var GRAVITY = 6; // pps/s
  var L_R_DRAG = 3; // pps that left/right movements decelerate by per second
  var FRICTION = 6.5; // extra left/right resistance when player is on a platform

  var Player = {
    x: Platforms[0].x + Platforms[0].width / 2 - PLAYER_WIDTH / 2,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    isOnPlatform: true,
    width: PLAYER_WIDTH,
    fuel: FUEL_MAX,
    isWaitingOnFuel: false
  };

  Player.tick = function (elapsed, inputs) {
    var tickDecel = elapsed * GRAVITY;
    var tickLRDrag = elapsed * L_R_DRAG;
    var tickAccel = elapsed * ACCELERATION;
    var tickFriction = elapsed * FRICTION;
    var fuelBurnt = elapsed * FUEL_BURN_RATE;

    if (Player.fuel > MIN_FUEL_TO_START_BURN) {
      Player.isWaitingOnFuel = false;
    }

    if (!Player.isWaitingOnFuel) {

      // this does actually let the player use their last bit of fuel twice, but oh well
      if (inputs.up) {
        Player.velocityY = Math.min(Player.velocityY + inputs.up * tickAccel, VELOCITY_MAX);
        Player.fuel = Math.max(0, Player.fuel - inputs.up * fuelBurnt);
      }
      if (inputs.left) {
        Player.velocityX = Math.max(Player.velocityX - inputs.left * tickAccel, -VELOCITY_MAX);
        Player.fuel = Math.max(0, Player.fuel - inputs.left * fuelBurnt);
      }
      if (inputs.right) {
        Player.velocityX = Math.min(Player.velocityX + inputs.right * tickAccel, VELOCITY_MAX);
        Player.fuel = Math.max(0, Player.fuel - inputs.right * fuelBurnt);
      }
    }

    if (Player.fuel <= 0) {
      Player.isWaitingOnFuel = true;
    }

    if (!Player.up) {
      Player.fuel = Math.min(FUEL_MAX, Player.fuel + elapsed * FUEL_RECHARGE_RATE);
    }


    var platformsInXRange = Platforms.getVisiblePlatforms().filter(function (platform) {
      return Player.x + Player.width + 1 >= platform.x && Player.x <= platform.x + platform.width;
    });
    var py = Math.round(Player.y);
    var standing = platformsInXRange.some(function (platform) {
      return py === platform.y + platform.height;
    });
    Player.isOnPlatform = standing;



    if (Player.velocityX > 0) {
      Player.velocityX = Math.max(0, Player.velocityX - tickLRDrag - (standing ? tickFriction : 0));
    } else if (Player.velocityX < 0) {
      Player.velocityX = Math.min(0, Player.velocityX + tickLRDrag + (standing ? tickFriction : 0));
    }
    Player.velocityY = Math.max(-VELOCITY_MAX, Player.velocityY - tickDecel);

    // can't go down through a platform
    if (standing && Player.velocityY < 0) {
      Player.velocityY = 0;
    }

    Player.x = Math.min(Canvas.width - Player.width, Math.max(0, Player.x + Player.velocityX));


    // if we're above a platform, the max we can fall is to the platform's surface
    var collisionPlatform = Player.velocityY < 0 && platformsInXRange.filter(function (platform) {
        return Player.y > platform.y+platform.height && Player.y + Player.velocityY <= platform.y+platform.height;
      })[0];

    if (collisionPlatform) {
      Player.y = collisionPlatform.y + collisionPlatform.height;
      Player.velocityY = 0;
      Player.isOnPlatform = true;
    } else {
      Player.y += Player.velocityY;
    }

  };



  Player.draw = function (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    var x = Player.x;
    var y = Canvas.mapY(Player.y);

    // left wing
    ctx.moveTo(x + 4, y - 3);
    ctx.quadraticCurveTo(x - 1, y - 4, x, y + 2);
    ctx.bezierCurveTo(x, y - 9, x + 1, y - 10, x + 4, y - 10);

    // left hull
    ctx.lineTo(x + 4, y - 25);

    // nose
    ctx.bezierCurveTo(x + 4, y - 27, x + 5, y - 30, x + 7, y - 30);
    ctx.bezierCurveTo(x + 8, y - 30, x + 9, y - 27, x + 10, y - 27);

    // right hull
    ctx.lineTo(x + 10, y - 10);

    // right wing
    ctx.bezierCurveTo(x + 13, y - 9, x + 14, y - 10, x + 14, y + 2);
    ctx.quadraticCurveTo(x + 15, y - 4, x + 10, y - 3);

    ctx.fill();

    // window
    ctx.fillStyle = '#8888ff';
    ctx.beginPath();
    ctx.arc(x + 7, y - 26, 2, 0, Math.PI * 2, false);
    ctx.fill();

    var ms = (new Date()).getMilliseconds();
    var flameExtras = [3, 5, 2, 7];
    var extra = Util.mapToArray(ms, 0, 999, flameExtras);


    if (!Player.isWaitingOnFuel) {

      var inputs = Input.getInputs();

      // bottom rocket
      if (inputs.up) {
        // red
        ctx.fillStyle = '#FF1D0E';
        ctx.beginPath();
        ctx.moveTo(x + 4, y - 2);
        ctx.lineTo(x + 10, y - 2);
        ctx.lineTo(x + 7, y + 9 + extra);
        ctx.fill();

        // yellow
        ctx.fillStyle = '#FFDF0C';
        ctx.beginPath();
        ctx.moveTo(x + 4, y - 2);
        ctx.lineTo(x + 10, y - 2);
        ctx.lineTo(x + 7, y + 5 + extra);
        ctx.fill();
      }

      // left rocket (lights up when right arrow is pressed)
      if (inputs.right > 0.1) {
        // red
        ctx.fillStyle = '#FF1D0E';
        ctx.beginPath();
        ctx.moveTo(x + 4, y - 20);
        ctx.lineTo(x + 4, y - 14);
        ctx.lineTo(x - 3 - extra * inputs.right, y - 17);
        ctx.fill();

        // yellow
        ctx.fillStyle = '#FFDF0C';
        ctx.beginPath();
        ctx.moveTo(x + 4, y - 20);
        ctx.lineTo(x + 4, y - 14);
        ctx.lineTo(x - extra * inputs.right, y - 17);
        ctx.fill();
      }

      // left rocket (lights up when right arrow is pressed)
      if (inputs.left > 0.1) {
        // red
        ctx.fillStyle = '#FF1D0E';
        ctx.beginPath();
        ctx.moveTo(x + 10, y - 20);
        ctx.lineTo(x + 10, y - 14);
        ctx.lineTo(x + 17 + extra * inputs.left, y - 17);
        ctx.fill();

        // yellow
        ctx.fillStyle = '#FFDF0C';
        ctx.beginPath();
        ctx.moveTo(x + 10, y - 20);
        ctx.lineTo(x + 10, y - 14);
        ctx.lineTo(x + 14 + extra * inputs.left, y - 17);
        ctx.fill();
      }
    }

    // (top wing and l/r jets should always be on top of bottom rocket)
    // top wing
    ctx.beginPath();
    ctx.moveTo(x + 7, y - 10);
    ctx.lineTo(x + 7, y);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 4, y - 17, 3, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 10, y - 17, 3, 0, Math.PI * 2, false);
    ctx.fill();
  };

  Player.drawFuelGuage = function(ctx) {
    ctx.strokeStyle = 'rgba(0, 121, 248, 0.8)';
    ctx.fillStyle = 'rgba(0, 121, 248, 0.7)';
    ctx.font = '10px Helvetica, sans-serif';
    var text = 'FUEL';
    var textWidth = ctx.measureText(text).width;
    ctx.lineWidth = 1;
    var guageWidth = 40;
    var padding = 10;
    ctx.fillText(text, Canvas.width - (textWidth + guageWidth + padding*2), padding);
    ctx.strokeRect(Canvas.width - (guageWidth + padding), padding, guageWidth, 10);
    ctx.fillRect(Canvas.width - (guageWidth + padding), padding, guageWidth * Player.fuel / FUEL_MAX, 10);
  };

  /*
  // this won't quite work because the alpha transparency is lost when copying the image over
  // set up pattern for minimap
  var mmpc = document.createElement('canvas');
  mmpc.height = mmpc.width = 10;
  var mmctx = mmpc.getContent('2d');
  mmctx.strokeStyle = 'rgba(0, 121, 248, 0.8)';
  mmctx.fillStyle = 'rgba(0, 121, 248, 0.7)';
  mmctx.fillRect(0, 0, mmctx.width, mmctx.height);
  mmctx.beginPath();
  mmctx.moveTo(0, mmctx.height);
  mmctx.lineTo(mmctx.width, mmctx.height);
  mmctx.lineTo(mmctx.width, 0);
  mmctx.stroke();
  */

  Player.drawMiniMap = function(ctx) {
    ctx.strokeStyle = 'rgba(0, 121, 248, 0.8)';
    ctx.fillStyle = 'rgba(0, 121, 248, 0.7)';
    var padding = 10;
    var mapHeight = 100 + ctx.lineWidth*2;
    ctx.lineWidth = 1;
    var mapWidth =  40 + ctx.lineWidth*2;
    // map bg
    ctx.fillRect(Canvas.width - (mapWidth + padding), Canvas.height - padding - mapHeight, mapWidth, mapHeight);
    ctx.strokeRect(Canvas.width - (mapWidth + padding), Canvas.height - padding - mapHeight, mapWidth, mapHeight);

    // text
    ctx.font = '10px Helvetica, sans-serif';
    var text = 'MAP';
    var textWidth = ctx.measureText(text).width;
    var textHeight = 12;
    ctx.fillText(text, Canvas.width - (textWidth + mapWidth + padding*2), Canvas.height-padding-textHeight);

    // planet
    ctx.fillStyle = '#887723';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(Canvas.width - mapWidth/2 -padding, Canvas.height-padding+36, mapWidth, Math.PI/180*240, Math.PI/180*300);
    ctx.fill();
    ctx.globalAlpha = 1;

    // player location
    var y = Canvas.height - (padding + Util.mapValue(Player.y, 0, Platforms.GAME_HEIGHT, 9, mapHeight));
    var x = Canvas.width - mapWidth/2 -padding;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x-3, y+3);
    ctx.lineTo(x+3, y+3);
    ctx.lineTo(x, y-3);
    ctx.fill();
  };

  root.Player = Player;

}(this));
