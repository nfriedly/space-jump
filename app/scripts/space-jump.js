(function() {
    "use strict";

    var canvas = document.getElementById('game-window');

    var ctx = canvas.getContext('2d');

    var gameHeight = canvas.clientHeight;
    var gameWidth = canvas.clientWidth;

    var platforms = [
        {
            x: 180,
            y: 210,
            width: 40
            // height is always 2
        }
    ];

    var PLAYER_HEIGHT = 20;
    var PLAYER_WIDTH = 20;

    var player = {
        x: platforms[0].x/2 - PLAYER_WIDTH/2,
        y: platforms[0].y - PLAYER_HEIGHT
    };

    // this should return 0 at game start
    function getOffset() {
        return player.y + PLAYER_HEIGHT/2 + gameHeight/2;
    }

    function drawPlatforms () {
        var offset = getOffset();
        var min = offset;
        var max = min + gameHeight;
        // this can probably be optimized by knowing what we included last time and working forward/backward from their indexes
        var platformstoDraw = platforms.filter(function(platform) {
            return platform.y > min && platform.y < max;
        });
        platformstoDraw.forEach(function(platform) {
            ctx.fillStyle = "#ff3300";
            ctx.fillRect(platform.x, platform.y - offset, platform.width, 2);
        });
    }

    function drawPlayer () {
        ctx.fillStyle = "#000000";
        ctx.fillRect(player.x, player.y, 20, 20);
    }

    function render() {
        drawPlatforms();
        drawPlayer();
        requestAnimationFrame(render);
    }

    render();

    setInterval(function() {
      player.x += Math.floor(6-Math.random() * 10);
      player.y += Math.floor(5-Math.random() * 10);
    })

}());
