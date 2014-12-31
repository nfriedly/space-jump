
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
