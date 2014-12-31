//(function () {
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

  var DEBUG = true;


  var VELOCITY_MAX = 10; // pixels per second
  var ACCELERATION = 0.1; // pps/keypress
  var DECELERATION = 2.5; // pps/s
  var FRICTION = 10; // left/right resistance when player is on a platform


  var paused = false;
  var lastTick = Date.now();

  function tick() {
    if (paused) {
      return;
    }
    var now = Date.now();
    var elapsed = (now - lastTick) / 1000;
    lastTick = now;
    var tickDecel = elapsed * DECELERATION;
    var tickFriction = elapsed * FRICTION;
    var platformsInXRange = getVisiblePlatforms().filter(function (platform) {
      return player.x + PLAYER_WIDTH + 1 >= platform.x && player.x <= platform.x + platform.width;
    });
    var py = Math.round(player.y);
    var standing = platformsInXRange.some(function (platform) {
      return py === platform.y + PLATFORM_HEIGHT;
    });
    player.isOnPlatform = standing;


    if (inputMap.up) {
      player.velocityY = Math.min(player.velocityY + ACCELERATION, VELOCITY_MAX);
    }
    if (inputMap.left) {
      player.velocityX = Math.max(player.velocityX - ACCELERATION, -VELOCITY_MAX);
    }
    if (inputMap.right) {
      player.velocityX = Math.min(player.velocityX + ACCELERATION, VELOCITY_MAX);
    }

    if (player.velocityX > 0) {
      player.velocityX = Math.max(0, player.velocityX - tickDecel - (standing ? tickFriction : 0));
    } else if (player.velocityX < 0) {
      player.velocityX = Math.min(0, player.velocityX + tickDecel + (standing ? tickFriction : 0));
    }
    player.velocityY = Math.max(-VELOCITY_MAX, player.velocityY - tickDecel);

    // can't go down through a platform
    if (standing && player.velocityY < 0) {
      player.velocityY = 0;
    }

    player.x = Math.min(canvas.width - PLAYER_WIDTH, Math.max(0, player.x + player.velocityX));


    // if we're above a platform, the max we can fall is to the platform's surface
    var collisionPlatform = player.velocityY < 0 && platformsInXRange.filter(function (platform) {
        return player.y > platform.y && player.y + player.velocityY <= platform.y;
      })[0];

    if (collisionPlatform) {
      player.y = collisionPlatform.y + PLATFORM_HEIGHT;
      player.velocityY = 0;
      player.isOnPlatform = true;
    } else {
      player.y += player.velocityY;
    }

    if (player.y < 0 && false) {
      paused = true;
      drawDialog('Game over', 'rgba(255,0,0,0.8)');
    } else if (player.y > GAME_HEIGHT + canvas.height/2) {
      paused = true;
      drawDialog('You win!', 'rgba(30, 255, 30, 0.8');
    } else {
      render();
      requestAnimationFrame(tick);
    }
  }


  canvas.onclick = function () {
    paused = !paused;
    if (!paused) {
      lastTick = Date.now();
      tick();
    }
    else {
      drawDialog('Paused', 'rgba(0,0,255,0.8)');
    }
  };



  tick();

//}());
