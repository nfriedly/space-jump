!function(t){"use strict";var e={};e.mapValue=function(t,e,a,i,n){return(t-e)*(n-i)/(a-e)+i},e.mapToArray=function(t,a,i,n){return n[Math.floor(e.mapValue(t,a,i+1,0,n.length))]},t.Util=e}(this),function(t){"use strict";var e={debug:!1,pause:!1};Object.keys(e).forEach(function(t){document.getElementById(t).onclick=function(){e[t]=!e[t]}}),t.Settings=e}(this),function(t){"use strict";function e(){var t=Date.now(),e=Math.round(1e5/(t-r))/100;r=t;var a=5,l=5,o=14,f=Object.keys(Player).filter(function(t){return"function"!=typeof Player[t]}).map(function(t){return t+": "+Player[t]}).concat(["offset: "+i.getOffset(),"platforms: "+Platforms.getVisiblePlatforms().length+"/"+Platforms.length,"fps: "+e,"% complete: "+Math.round(i.getOffset()/Platforms.GAME_HEIGHT*1e4)/100]);n.font="10pt Helvetica",n.textBaseline="top";var h=f.reduce(function(t,e){return Math.max(t,n.measureText(e).width)},0);n.fillStyle="rgba(0,0,0,0.8)",n.fillRect(0,0,h+2*l,f.length*o+2*a),n.fillStyle="lime",f.forEach(function(t,e){n.fillText(t,l,e*o+a)})}function a(){n.clearRect(0,0,i.width,i.height)}var i=document.getElementById("game-window"),n=i.getContext("2d");i.getOffset=function(){return Player.y-i.height/2},i.mapY=function(t,e,a){return e=e||0,a=a||i.getOffset(),i.height-(t-a)-e};var r=Date.now();i.drawDialog=function(t,e){n.font="20px Helvetica",n.textBaseline="top";var a=10,r=n.measureText(t).width+2*a,l=40,o=i.width/2-r/2,f=i.height/2-l/2;n.fillStyle=e||"rgba(255, 255, 255, 0.8)",n.fillRect(o,f,r,l),n.fillStyle="white",n.fillText(t,o+a,f+a)},i.render=function(){Background.image.loaded?Background.draw(n):a(),Platforms.draw(n),Player.draw(n),Settings.debug&&e()},t.Canvas=i}(this),function(t){"use strict";function e(t,e,a){this.x=t,this.y=e,this.width=a}var a=2;e.prototype.height=a,e.prototype.isPlanet=!1,e.prototype.toString=function(){var t=["(",this.x,"+",this.width,", ",this.y,")"];return this.isPlanet&&t.unshift("Planet:"),t.join("")},e.prototype.getPath=function(){if(this._path)return this._path;for(var t,e=this,a=!this.isPlanet,i=[{x:e.x,y:e.y}],n=e.x,r=e.x+e.width;;){if(n+=Math.max(1,Math.abs(21*Math.cos(n))),n>r)break;t=e.y+3*Math.cos(n)+(a?-4:4),t=a?Math.min(e.y+1,t):Math.max(e.y-1,t),i.push({x:n,y:t})}var l=a?e.y+e.height:e.y-e.height;return i.push({x:r,y:e.y}),i.push({x:r,y:l}),i.push({x:e.x,y:l}),this._path=i,i},e.prototype.draw=function(t,e){var a=this,i=Canvas.mapY(a.y,a.height,t),n=e.createLinearGradient(a.x,i,a.x+2*a.width/3,2*a.height);n.addColorStop(0,"#887723"),n.addColorStop(1,"#662211"),e.fillStyle=n;var r=a.getPath();e.beginPath(),r.forEach(function(i){e.lineTo(i.x,Canvas.mapY(i.y,a.height,t))}),e.fill()};var i=Canvas.height/2,n=new e(0,0-i,Canvas.width);n.isPlanet=!0,n.height=i;for(var r=[n],l=n,o=1;100>=o;o++){var f=l.y+l.height+60+Math.round(100*Math.abs(Math.cos(o)))+2*o,h=60+Math.round(150*Math.abs(Math.sin(o))-1.5*o),y=Canvas.width/2+Math.round(Math.cos(o)*Canvas.width/2)-h/2;l=new e(y,f,h),r.push(l)}r.GAME_HEIGHT=r[r.length-1].y+200,r.getVisiblePlatforms=function(){var t=Canvas.getOffset(),e=t+Canvas.height;return r.filter(function(a){return a.y+a.height>t&&a.y<e})},r.draw=function(t){var e=r.getVisiblePlatforms(),a=Canvas.getOffset();e.forEach(function(e){e.draw(a,t)})},t.Platforms=r}(this),function(t){"use strict";var e=15,a={x:Platforms[0].x+Platforms[0].width/2-e/2,y:0,velocityX:0,velocityY:0,isOnPlatform:!0,width:e};a.draw=function(t){t.fillStyle="#ffffff",t.beginPath();var e=a.x,i=Canvas.mapY(a.y);t.moveTo(e+4,i-3),t.quadraticCurveTo(e-1,i-4,e,i+2),t.bezierCurveTo(e,i-9,e+1,i-10,e+4,i-10),t.lineTo(e+4,i-25),t.bezierCurveTo(e+4,i-27,e+5,i-30,e+7,i-30),t.bezierCurveTo(e+8,i-30,e+9,i-27,e+10,i-27),t.lineTo(e+10,i-10),t.bezierCurveTo(e+13,i-9,e+14,i-10,e+14,i+2),t.quadraticCurveTo(e+15,i-4,e+10,i-3),t.fill(),t.fillStyle="#8888ff",t.beginPath(),t.arc(e+7,i-26,2,0,2*Math.PI,!1),t.fill();var n=(new Date).getMilliseconds(),r=[3,5,2,7],l=Util.mapToArray(n,0,999,r);Keyboard.inputMap.up&&(t.fillStyle="#FF1D0E",t.beginPath(),t.moveTo(e+4,i-2),t.lineTo(e+10,i-2),t.lineTo(e+7,i+9+l),t.fill(),t.fillStyle="#FFDF0C",t.beginPath(),t.moveTo(e+4,i-2),t.lineTo(e+10,i-2),t.lineTo(e+7,i+5+l),t.fill()),Keyboard.inputMap.right&&(t.fillStyle="#FF1D0E",t.beginPath(),t.moveTo(e+4,i-20),t.lineTo(e+4,i-14),t.lineTo(e-3-l,i-17),t.fill(),t.fillStyle="#FFDF0C",t.beginPath(),t.moveTo(e+4,i-20),t.lineTo(e+4,i-14),t.lineTo(e-l,i-17),t.fill()),Keyboard.inputMap.left&&(t.fillStyle="#FF1D0E",t.beginPath(),t.moveTo(e+10,i-20),t.lineTo(e+10,i-14),t.lineTo(e+17+l,i-17),t.fill(),t.fillStyle="#FFDF0C",t.beginPath(),t.moveTo(e+10,i-20),t.lineTo(e+10,i-14),t.lineTo(e+14+l,i-17),t.fill()),t.beginPath(),t.moveTo(e+7,i-10),t.lineTo(e+7,i),t.stroke(),t.fillStyle="#ffffff",t.beginPath(),t.arc(e+4,i-17,3,0,2*Math.PI,!1),t.fill(),t.fillStyle="#ffffff",t.beginPath(),t.arc(e+10,i-17,3,0,2*Math.PI,!1),t.fill()},t.Player=a}(this),function(t){"use strict";var e={};e.image=new Image,e.image.onload=function(){e.image.loaded=!0},e.image.src="images/PIA17843.jpg",e.draw=function(t){var a=e.image,i=Canvas.getOffset()/(Platforms.GAME_HEIGHT+20)*a.height;t.drawImage(a,0,Canvas.height-a.height+i)},t.Background=e}(this),function(t){"use strict";function e(t){var e=o[t.keyCode];e&&(f[e]=!0)}function a(t){var e=o[t.keyCode];e&&(f[e]=!1)}var i={},n="up",r="left",l="right",o=[];o[38]=n,o[37]=r,o[39]=l;var f=i.inputMap={up:!1,left:!1,right:!1};window.addEventListener("keydown",e,!0),window.addEventListener("keyup",a,!0),t.Keyboard=i}(this),function(){"use strict";function t(){var l=Date.now(),o=(l-r)/1e3;r=l,Settings.paused&&(Canvas.drawDialog("Paused","rgba(0,0,255,0.8)"),setTimeout(t,200));var f=o*i,h=o*a,y=o*n,s=Platforms.getVisiblePlatforms().filter(function(t){return Player.x+Player.width+1>=t.x&&Player.x<=t.x+t.width}),u=Math.round(Player.y),c=s.some(function(t){return u===t.y+t.height});Player.isOnPlatform=c,Keyboard.inputMap.up&&(Player.velocityY=Math.min(Player.velocityY+h,e)),Keyboard.inputMap.left&&(Player.velocityX=Math.max(Player.velocityX-h,-e)),Keyboard.inputMap.right&&(Player.velocityX=Math.min(Player.velocityX+h,e)),Player.velocityX>0?Player.velocityX=Math.max(0,Player.velocityX-f-(c?y:0)):Player.velocityX<0&&(Player.velocityX=Math.min(0,Player.velocityX+f+(c?y:0))),Player.velocityY=Math.max(-e,Player.velocityY-f),c&&Player.velocityY<0&&(Player.velocityY=0),Player.x=Math.min(Canvas.width-Player.width,Math.max(0,Player.x+Player.velocityX));var v=Player.velocityY<0&&s.filter(function(t){return Player.y>t.y&&Player.y+Player.velocityY<=t.y})[0];v?(Player.y=v.y+v.height,Player.velocityY=0,Player.isOnPlatform=!0):Player.y+=Player.velocityY,Player.y>Platforms.GAME_HEIGHT+Canvas.height/2?(Settings.paused=!0,Canvas.drawDialog("You win!","rgba(30, 255, 30, 0.8")):(Canvas.render(),requestAnimationFrame(t))}var e=10,a=6,i=2.5,n=10,r=Date.now();t()}();