var PLATFORM_HEIGHT = 2;

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

var planet = new Platform(0, 0 - PLATFORM_HEIGHT, canvas.width);
planet.isPlanet = true;
planet.height = canvas.height / 2;
// todo: add some craters to planet.draw =

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

function getVisiblePlatforms() {
  var min = getOffset();
  var max = min + canvas.height;
  // this can probably be optimized by knowing what we included last time and working forward/backward from their indexes
  return platforms.filter(function (platform) {
    return platform.y > min && platform.y < max;
  });
}


function drawPlatforms() {
  var platformsToDraw = getVisiblePlatforms();
  var offset = getOffset();
  platformsToDraw.forEach(function (platform) {
    platform.draw(offset);
  });
}

