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

  var DEBUG = true;

  var canvas = document.getElementById('game-window');

  var ctx = canvas.getContext('2d');

  var PLATFORM_HEIGHT = 2;
  var PLAYER_WIDTH = 15;

  function Platform(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
  }

  Platform.prototype.height = PLATFORM_HEIGHT;
  Platform.prototype.isPlanet = false;

  Platform.prototype.toString = function () {
    var bits = ['(', this.x, '+', this.width, ', ', this.y, ')'];
    if (this.isPlanet) {
      bits.unshift('Planet:');
    }
    return bits.join('');
  };

  Platform.prototype.getPath = function () {
    if (this._path) {
      return this._path;
    }
    var platform = this;
    var smoothSideUp = !this.isPlanet;
    var path = [{
      x: platform.x,
      y: platform.y
    }];
    var x = platform.x;
    var y;
    var maxX = platform.x + platform.width;
    while (true) {
      x += Math.max(1, Math.abs(Math.cos(x) * 21));
      // if X is past the edge of the platform, skip it. We'll add a couple more points that smooth out the edge.
      if (x > maxX) {
        break;
      }
      y = platform.y + Math.cos(x) * 3 + (smoothSideUp ? -4 : 4);
      // constrain the rumples to not go past the top of floating platforms
      y = smoothSideUp ? Math.min(platform.y + 1, y) : Math.max(platform.y - 1, y);
      path.push({x: x, y: y});
    }
    var smoothSideY = smoothSideUp ? platform.y + platform.height : platform.y - platform.height;
    path.push({x: maxX, y: platform.y});
    path.push({x: maxX, y: smoothSideY});
    path.push({x: platform.x, y: smoothSideY});
    this._path = path;
    return path;
  };

  Platform.prototype.draw = function (offset) {
    var platform = this;
    var y = toCanvasY(platform.y, PLATFORM_HEIGHT, offset);
    var gradient = ctx.createLinearGradient(platform.x, y, platform.x + platform.width * 2 / 3, platform.height * 2);
    gradient.addColorStop(0, '#887723');
    gradient.addColorStop(1, '#662211');
    ctx.fillStyle = gradient;
    var path = platform.getPath();
    ctx.beginPath();
    path.forEach(function (point) {
      ctx.lineTo(point.x, toCanvasY(point.y));
    });
    ctx.fill();
  };

  var planet = new Platform(0, canvas.height * 0.75 - PLATFORM_HEIGHT, canvas.width);
  planet.isPlanet = true;
  planet.height = canvas.height / 2;
// todo: add some craters planet.draw =

  var platforms = [
    planet
  ];

  // generate the rest of the platforms
  var lastPlatform = planet;
  for (var i = 1; i <= 100; i++) {
    var y = lastPlatform.y + 60 + Math.round(Math.abs(Math.cos(i)) * 100) + i * 2;
    var width = 60 + Math.round(Math.abs(Math.sin(i)) * 150 - i * 1.5);
    var x = canvas.width / 2 + Math.round(Math.cos(i) * canvas.width / 2) - width/2;
    lastPlatform = new Platform(x, y, width);
    platforms.push(lastPlatform);
  }

  var GAME_HEIGHT = platforms[platforms.length-1].y + 200;

  var VELOCITY_MAX = 10; // pixels per second
  var ACCELERATION = 1; // pps/keypress
  var DECELERATION = 2.5; // pps/s

  var player = {
    x: platforms[0].x + platforms[0].width / 2 - PLAYER_WIDTH / 2,
    y: platforms[0].y + PLATFORM_HEIGHT,
    velocityX: 0,
    velocityY: 0,
    isOnPlatform: true
  };

// this should return 0 at game start
// todo: consider letting the player move up/down the canvas a little based on velocity
  function getOffset() {
    return player.y - canvas.height / 2;
  }

  function getVisiblePlatforms() {
    var min = getOffset();
    var max = min + canvas.height;
    // this can probably be optimized by knowing what we included last time and working forward/backward from their indexes
    return platforms.filter(function (platform) {
      return platform.y > min && platform.y < max;
    });
  }


// The game calculates y coordinates starting at the bottom and going up (so that it can add content at the top)
// the canvas element calculates y coordinates starting at the top-left and going down
// this function translates from game y to canvas y based on the player's position.
  function toCanvasY(gameY, height, offset) {
    height = height || 0;
    offset = offset || getOffset();
    return canvas.height - (gameY - offset) - height;
  }

  function drawPlatforms() {
    var platformsToDraw = getVisiblePlatforms();
    var offset = getOffset();
    platformsToDraw.forEach(function (platform) {
      platform.draw(offset);
    });
  }


  function drawPlayer() {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    var x = player.x;
    var y = toCanvasY(player.y);

    // left wing
    ctx.moveTo(player.x+4, y-3);
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

    // top wing
    ctx.beginPath();
    ctx.moveTo(x+7, y-10);
    ctx.lineTo(x+7, y);
    ctx.stroke();

    // window
    ctx.fillStyle = '#8888ff';
    ctx.beginPath();
    ctx.arc(x+7, y-26, 2, 0, Math.PI*2, false);
    ctx.fill();
  }

  var lastFrameTime = Date.now();
  function drawDebug() {

    // calculate framerate
    var now = Date.now();
    var fps = Math.round(100000/(now-lastFrameTime))/100;
    lastFrameTime = now;

    var headPad = 5;
    var sidePad = 5;
    var lineHeight = 14;
    var lines = Object.keys(player).map(function (key) {
      return key + ': ' + player[key];
    }).concat([
      'offset: ' + getOffset(),
      'platforms: ' + getVisiblePlatforms().length + '/' + platforms.length,
      'fps: ' + fps,
      '% complete: ' + Math.round(getOffset() / GAME_HEIGHT * 10000)/100
    ]);

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

  function drawDialog(text, background) {
    ctx.font = '20px Helvetica';
    ctx.textBaseline = 'top';
    var padding = 10;
    var width = ctx.measureText(text).width + padding * 2;
    var height = 40;
    var left = canvas.width / 2 - width / 2;
    var top = canvas.height / 2 - height / 2;
    ctx.fillStyle = background || 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(left, top, width, height);
    ctx.fillStyle = 'white';
    ctx.fillText(text, left + padding, top + padding);
  }

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }



  var backgroundImage = new Image();
  backgroundImage.onload = function() {
    backgroundImage.loaded = true;
  };
  backgroundImage.src = 'images/PIA17843.jpg';


  function drawBackground() {
    if (!backgroundImage.loaded) {
      return clear();
    }
    var bg = backgroundImage;

    var offset = getOffset() / GAME_HEIGHT * bg.height;
    ctx.drawImage(bg, 0, canvas.height - bg.height + offset);
  }


  function render() {
    drawBackground();
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
    var platformsInXRange = getVisiblePlatforms().filter(function (platform) {
      return player.x + PLAYER_WIDTH + 1 >= platform.x && player.x <= platform.x + platform.width;
    });
    var py = Math.round(player.y);
    var standing = platformsInXRange.some(function (platform) {
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

    if (player.y < 0) {
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

  function handleKeypress(evt) {
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

  window.addEventListener('keydown', handleKeypress, true);


  tick();

}());
