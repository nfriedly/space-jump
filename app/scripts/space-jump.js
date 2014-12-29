//(function() {
//  'use strict';

  var DEBUG = true;

  var canvas = document.getElementById('game-window');

  var ctx = canvas.getContext('2d');

  var PLATFORM_HEIGHT = 2;
  var platforms = [
    {
      x: 0,
      y: canvas.height *.75 - PLATFORM_HEIGHT,
      width: canvas.width
      // height is always PLATFORM_HEIGHT
    }
  ];

  platforms.push(
    {
      x: 80,
      y: platforms[0].y + 100,
      width: 80
      // height is always PLATFORM_HEIGHT
    }
  );

  var VELOCITY_MAX = 10; // pixels per second
  var ACCELERATION = 1; // pps/keypress
  var DECELERATION = 2.5; // pps/s
  var PLAYER_HEIGHT = 20;
  var PLAYER_WIDTH = 20;

  var player = {
    x: platforms[0].x + platforms[0].width/2 - PLAYER_WIDTH/2,
    y: platforms[0].y + PLATFORM_HEIGHT,
    velocityX: 0,
    velocityY: 0,
    isOnPlatform: true
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


  // The game calculates y coordinates starting at the bottom and going up (so that it can add content at the top)
  // the canvas element calculates y coordinates starting at the top-left and going down
  // this function translates from game y to canvas y based on the player's position.
  function toCanvasY(gameY, height) {
    height = height || 0;
    var offset = getOffset();
    return canvas.height - (gameY - offset) - height;
  }

  function calculatePlanetPath(platform) {
    var path = [{
      x: platform.x,
      y: platform.y
    }];
    var x = 0;
    var y;
    while (x < platform.width) {
      x += Math.max(1, Math.abs(Math.cos(x) * 21));
      y = platform.y + 4 + Math.cos(x) * 3; //Math.cos(x).toFixed(1).substr(-1);
      path.push({x:x, y:y});
    }
    path.push({x: platform.x + platform.width, y: platform.y - canvas.height/2});
    path.push({x: platform.x, y: platform.y - canvas.height/2});
    return path;
  }

  function drawPlatforms () {
    var platformsToDraw = getVisiblePlatforms();
    platformsToDraw.forEach(function(platform, i) {
      var y = toCanvasY(platform.y, PLATFORM_HEIGHT);
      if (!i) {
        var gradient = ctx.createLinearGradient(platform.x, y, platform.x + platform.width * 2/3, canvas.height);
        gradient.addColorStop(0,'#887723');
        gradient.addColorStop(1,'#662211');
        ctx.fillStyle = gradient;
        platform.path = platform.path || calculatePlanetPath(platform);
        ctx.beginPath();
        platform.path.forEach(function(point) {
          ctx.lineTo(point.x, toCanvasY(point.y));
        });
        ctx.fill();
      } else {
        ctx.fillStyle = '#ff3300';
        ctx.fillRect(platform.x, toCanvasY(platform.y, PLATFORM_HEIGHT), platform.width, PLATFORM_HEIGHT);
      }
    });
  }

  function drawPlayer () {
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x, toCanvasY(player.y, PLAYER_HEIGHT), 20, 20);
  }

  function drawDebug() {
    // todo: figure out how to calculate framerate
    var headPad = 5;
    var sidePad = 5;
    var lineHeight = 14;
    var lines = Object.keys(player).map(function(key) {
      return key + ': ' + player[key];
    }).concat([
      'offset: ' + getOffset(),
      'platforms: ' + getVisiblePlatforms().length + '/' + platforms.length
    ]);
    ctx.font = '10pt Helvetica';
    ctx.textBaseline = 'top';

    var width = lines.reduce(function(curWidth, str) {
      return Math.max(curWidth, ctx.measureText(str).width);
    }, 0);

    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, width + sidePad*2 , (lines.length) * lineHeight + headPad*2);

    ctx.fillStyle = 'lime';
    lines.forEach(function(line, offset) {
      ctx.fillText(line, sidePad, offset*lineHeight + headPad);
    });
  }

  function drawDialog(text, background) {
    ctx.font = '20px Helvetica';
    ctx.textBaseline = 'top';
    var padding = 10;
    var width = ctx.measureText(text).width + padding*2;
    var height = 40;
    var left = canvas.width/2-width/2;
    var top = canvas.height/2-height/2;
    ctx.fillStyle = background || 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(left, top, width, height);
    ctx.fillStyle = 'white';
    ctx.fillText(text, left + padding, top + padding);
  }

  function clear() {
    ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
  }


  function render() {
    clear();
    drawPlatforms();
    drawPlayer();
    if (DEBUG) {
      drawDebug();
    }
  }

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
    var platformsInXRange = getVisiblePlatforms().filter(function(platform) {
      return player.x+PLAYER_WIDTH+1 >= platform.x && player.x <= platform.x + platform.width;
    });
    var py = Math.round(player.y);
    var standing = platformsInXRange.some(function(platform) {
      return py === platform.y + PLATFORM_HEIGHT;
    });
    player.isOnPlatform = standing;
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

    player.x = Math.min(canvas.width, Math.max(0, player.x + player.velocityX));


    // if we're above a platform, the max we can fall is to the platform's surface
    var collisionPlatform = player.velocityY < 0 && platformsInXRange.filter(function(platform) {
      return player.y > platform.y && player.y + player.velocityY <= platform.y;
    })[0];

    if (collisionPlatform) {
      player.y = collisionPlatform.y + PLATFORM_HEIGHT;
      player.velocityY = 0;
      player.isOnPlatform = true;
    } else {
      player.y += player.velocityY;
    }

    if (player.y < 0) {
      paused = true;
      drawDialog('Game over', 'rgba(255,0,0,0.8)');
    } else {
      render();
      requestAnimationFrame(tick);
    }
  }


  canvas.onclick = function() {
    paused = !paused;
    if (!paused) {
      lastTick = Date.now();
      tick();
    }
    else {
      drawDialog('Paused', 'rgba(0,0,255,0.8)');
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


  //tick();

//}());
