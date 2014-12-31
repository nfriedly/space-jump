var canvas = document.getElementById('game-window');

var ctx = canvas.getContext('2d');

// this should return 0 at game start
// todo: consider letting the player move up/down the canvas a little based on velocity
function getOffset() {
  return player.y - canvas.height/2;
}

// The game calculates y coordinates starting at the bottom and going up (so that it can add content at the top)
// the canvas element calculates y coordinates starting at the top-left and going down
// this function translates from game y to canvas y based on the player's position.
function toCanvasY(gameY, height, offset) {
  height = height || 0;
  offset = offset || getOffset();
  return canvas.height - (gameY - offset) - height;
}

function mapValue(value, fromLow, fromHigh, toLow, toHigh) {
  return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow;
}

function mapToArray(value, fromLow, fromHigh, array) {
  // the +1 is to ensure we never hit array.length (because the last item is at array.length -1)
  return array[Math.floor(mapValue(value, fromLow, fromHigh + 1, 0, array.length))]
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


function render() {
  drawBackground();
  drawPlatforms();
  drawPlayer();
  if (DEBUG) {
    drawDebug();
  }
}
