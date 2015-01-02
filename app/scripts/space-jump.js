/* exported: SpaceJump */
/* globals Settings, Player, Canvas, Keyboard, Platforms */

(function () {
  'use strict';

  /*
   function Point(x, y) {
   this.x = x;
   this.y = y;
   }

   Point.prototype.toString = function () {
   return ['(', this.x, ', ', this.y, ')'].join('');
   };
   */


  var VELOCITY_MAX = 10; // pixels per second
  var ACCELERATION = 6; // pps/keypress
  var DECELERATION = 2.5; // pps/s
  var FRICTION = 10; // left/right resistance when player is on a platform


  var lastTick = Date.now();

  function tick() {
    var now = Date.now();
    var elapsed = (now - lastTick) / 1000;
    lastTick = now;
    if (Settings.paused) {
      Canvas.drawDialog('Paused', 'rgba(0,0,255,0.8)');
      setTimeout(tick, 200);
    }
    var tickDecel = elapsed * DECELERATION;
    var tickAccel = elapsed * ACCELERATION;
    var tickFriction = elapsed * FRICTION;
    var platformsInXRange = Platforms.getVisiblePlatforms().filter(function (platform) {
      return Player.x + Player.width + 1 >= platform.x && Player.x <= platform.x + platform.width;
    });
    var py = Math.round(Player.y);
    var standing = platformsInXRange.some(function (platform) {
      return py === platform.y + platform.height;
    });
    Player.isOnPlatform = standing;


    if (Keyboard.inputMap.up) {
      Player.velocityY = Math.min(Player.velocityY + tickAccel, VELOCITY_MAX);
    }
    if (Keyboard.inputMap.left) {
      Player.velocityX = Math.max(Player.velocityX - tickAccel, -VELOCITY_MAX);
    }
    if (Keyboard.inputMap.right) {
      Player.velocityX = Math.min(Player.velocityX + tickAccel, VELOCITY_MAX);
    }

    if (Player.velocityX > 0) {
      Player.velocityX = Math.max(0, Player.velocityX - tickDecel - (standing ? tickFriction : 0));
    } else if (Player.velocityX < 0) {
      Player.velocityX = Math.min(0, Player.velocityX + tickDecel + (standing ? tickFriction : 0));
    }
    Player.velocityY = Math.max(-VELOCITY_MAX, Player.velocityY - tickDecel);

    // can't go down through a platform
    if (standing && Player.velocityY < 0) {
      Player.velocityY = 0;
    }

    Player.x = Math.min(Canvas.width - Player.width, Math.max(0, Player.x + Player.velocityX));


    // if we're above a platform, the max we can fall is to the platform's surface
    var collisionPlatform = Player.velocityY < 0 && platformsInXRange.filter(function (platform) {
        return Player.y > platform.y && Player.y + Player.velocityY <= platform.y;
      })[0];

    if (collisionPlatform) {
      Player.y = collisionPlatform.y + collisionPlatform.height;
      Player.velocityY = 0;
      Player.isOnPlatform = true;
    } else {
      Player.y += Player.velocityY;
    }

    if (Player.y < 0 && false) {
      Settings.paused = true;
      Canvas.drawDialog('Game over', 'rgba(255,0,0,0.8)');
    } else if (Player.y > Platforms.GAME_HEIGHT + Canvas.height/2) {
      Settings.paused = true;
      Canvas.drawDialog('You win!', 'rgba(30, 255, 30, 0.8');
    } else {
      Canvas.render();
      requestAnimationFrame(tick);
    }
  }





  tick();

}());
