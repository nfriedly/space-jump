//(function() {
//  "use strict";

  var DEBUG = true;

  var canvas = document.getElementById('game-window');

  var ctx = canvas.getContext('2d');
  var context = ctx; // make my life easier

  var PLATFORM_HEIGHT = 2;
  var platforms = [
    {
      x: canvas.width/2 - 40/2,
      y: canvas.height/2 - PLATFORM_HEIGHT,
      width: 40
      // height is always 2
    }
  ];

  var VELOCITY_MAX = 10; // pixels per second
  var ACCELERATION = 1; // pps/keypress
  var DECELERATION = 0.5; // pps/s
  var PLAYER_HEIGHT = 20;
  var PLAYER_WIDTH = 20;

  var player = {
    x: platforms[0].x + platforms[0].width/2 - PLAYER_WIDTH/2,
    y: platforms[0].y + PLATFORM_HEIGHT,
    velocityX: 0,
    velocityY: 0
  };

  // this should return 0 at game start
  // todo: consider letting the player move up/down the canvas a little based on velocity
  function getOffset() {
    return player.y - canvas.height/2;
  }

  function getVisiblePlatforms() {
    var min = getOffset();
    var max = min + canvas.height;
    // this can probably be optimized by knowing what we included last time and working forward/backward from their indexes
    return platforms.filter(function(platform) {
      return platform.y > min && platform.y < max;
    });
  }


  function isOnPlatform() {
    var platforms = getVisiblePlatforms();
    return platforms.some(function(platform) {
      return player.y == platform.y + PLATFORM_HEIGHT && player.x+PLAYER_WIDTH+1 >= platform.x && player.x <= platform.x + platform.width;
    })
  }

  // The game calculates y coordinates starting at the bottom and going up (so that it can add content at the top)
  // the canvas element calculates y coordinates starting at the top-left and going down
  // this function translates from game y to canvas y based on the player's position.
  function toCanvasY(gameY, height) {
    height = height || 0;
    var offset = getOffset();
    return canvas.height - (gameY - offset) - height;
  }

  function drawPlatforms () {
    var platformsToDraw = getVisiblePlatforms();
    platformsToDraw.forEach(function(platform) {
      ctx.fillStyle = "#ff3300";
      ctx.fillRect(platform.x, toCanvasY(platform.y, PLATFORM_HEIGHT), platform.width, 2);
    });
  }

  function drawPlayer () {
    ctx.fillStyle = "#000000";
    ctx.fillRect(player.x, toCanvasY(player.y, PLAYER_HEIGHT), 20, 20);
  }

  function drawDebug() {
    var headPad = 15;
    var sidePad = 5;
    var lineHeight = 12;
    var lines = Object.keys(player).map(function(key) {
      return key + ': ' + player[key];
    }).concat([
      'isOnPlatform: ' + isOnPlatform(),
      'offset: ' + getOffset()
    ]);
    ctx.font = '10pt Helvetica';

    var width = lines.reduce(function(a, b) {
      return Math.max(ctx.measureText(a).width, ctx.measureText(b).width)
    });

    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, width + sidePad*2 , (lines.length-1) * lineHeight + headPad*2);

    ctx.fillStyle = 'lime';
    lines.forEach(function(line, offset) {
      ctx.fillText(line, sidePad, offset*lineHeight + headPad);
    });

  }

  function clear() {
    ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
  }

  var paused = false;
  var lastTick = Date.now();
  function tick() {
    if (paused) return;
    var now = Date.now();
    var elapsed = (now - lastTick) / 1000;
    var tickDecel = elapsed * DECELERATION;
    var standing = isOnPlatform();
    if (player.velocityX > 0) {
      player.velocityX = Math.max(0, player.velocityX - tickDecel);
    } else if (player.velocityX < 0) {
      player.velocityX = Math.min(0, player.velocityX + tickDecel);
    }
    player.velocityY = Math.max(-VELOCITY_MAX, player.velocityY - tickDecel);
    // can't go down through a platform
    if (standing && player.velocityY < 0) {
      player.velocityY = 0;
    }
    player.x += player.velocityX;
    player.y += player.velocityY;
    if (player.y < 0) {
      paused = true;
      ctx.fillStyle = "rgba(255,0,0,0.8)";
      ctx.fillRect(canvas.width/2-60, canvas.height/2-40, 120, 80);
      ctx.font = '40pt Helvetica';
      ctx.fillStyle = 'black';
      ctx.fillText("Game over", canvas.width/2-50, canvas.height/2+10);
    } else {
      render();
      requestAnimationFrame(tick);
    }
    lastTick = now;
  }

  function render() {
    clear();
    if (DEBUG) {
      drawDebug();
    }
    drawPlatforms();
    drawPlayer();
  }

  canvas.onclick = function() {
    paused = !paused;
    if (!paused) {
      lastTick = Date.now();
      tick();
    }
    else {
      ctx.fillStyle = "rgba(0,0,255,0.8)";
      ctx.fillRect(canvas.width/2-60, canvas.height/2-40, 120, 80);
      ctx.font = '40pt Helvetica';
      ctx.fillStyle = 'black';
      ctx.fillText("Paused", canvas.width/2-50, canvas.height/2+10);
    }
  };

  function handleKeypress(evt){
    switch (evt.keyCode) {
      case 38:  /* Up arrow was pressed */
        player.velocityY = Math.min(player.velocityY + ACCELERATION, VELOCITY_MAX);
        break;
      case 40:  /* Down arrow was pressed */
        player.velocityY = Math.max(player.velocityY - ACCELERATION, -VELOCITY_MAX);
        break;
      case 37:  /* Left arrow was pressed */
        player.velocityX = Math.max(player.velocityX - ACCELERATION, -VELOCITY_MAX);
        break;
      case 39:  /* Right arrow was pressed */
        player.velocityX = Math.min(player.velocityX + ACCELERATION, VELOCITY_MAX);
        break;
    }
  }

  window.addEventListener('keydown',handleKeypress,true);


  tick();

//}());
