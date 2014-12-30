!function(){"use strict";function t(t,e,i){this.x=t,this.y=e,this.width=i}function e(){return k.y-s.height/2}function i(){var t=e(),i=t+s.height;return w.filter(function(e){return e.y>t&&e.y<i})}function a(t,i,a){return i=i||0,a=a||e(),s.height-(t-a)-i}function n(){var t=i(),a=e();t.forEach(function(t){t.draw(a)})}function o(){d.fillStyle="#ffffff",d.beginPath();var t=k.x,e=a(k.y);d.moveTo(k.x+4,e-3),d.quadraticCurveTo(t-1,e-4,t,e+2),d.bezierCurveTo(t,e-9,t+1,e-10,t+4,e-10),d.lineTo(t+4,e-25),d.bezierCurveTo(t+4,e-27,t+5,e-30,t+7,e-30),d.bezierCurveTo(t+8,e-30,t+9,e-27,t+10,e-27),d.lineTo(t+10,e-10),d.bezierCurveTo(t+13,e-9,t+14,e-10,t+14,e+2),d.quadraticCurveTo(t+15,e-4,t+10,e-3),d.fill(),d.beginPath(),d.moveTo(t+7,e-10),d.lineTo(t+7,e),d.stroke(),d.fillStyle="#8888ff",d.beginPath(),d.arc(t+7,e-26,2,0,2*Math.PI,!1),d.fill()}function r(){var t=Date.now(),a=Math.round(1e5/(t-D))/100;D=t;var n=5,o=5,r=14,h=Object.keys(k).map(function(t){return t+": "+k[t]}).concat(["offset: "+e(),"platforms: "+i().length+"/"+w.length,"fps: "+a,"% complete: "+Math.round(e()/Y*1e4)/100]);d.font="10pt Helvetica",d.textBaseline="top";var l=h.reduce(function(t,e){return Math.max(t,d.measureText(e).width)},0);d.fillStyle="rgba(0,0,0,0.8)",d.fillRect(0,0,l+2*o,h.length*r+2*n),d.fillStyle="lime",h.forEach(function(t,e){d.fillText(t,o,e*r+n)})}function h(t,e){d.font="20px Helvetica",d.textBaseline="top";var i=10,a=d.measureText(t).width+2*i,n=40,o=s.width/2-a/2,r=s.height/2-n/2;d.fillStyle=e||"rgba(255, 255, 255, 0.8)",d.fillRect(o,r,a,n),d.fillStyle="white",d.fillText(t,o+i,r+i)}function l(){d.clearRect(0,0,s.width,s.height)}function c(){if(!E.loaded)return l();var t=E,i=e()/Y*t.height;d.drawImage(t,0,s.height-t.height+i)}function y(){c(),n(),o(),v&&r()}function f(){if(!I){var t=Date.now(),e=(t-z)/1e3;z=t;var a=e*S,n=i().filter(function(t){return k.x+g+1>=t.x&&k.x<=t.x+t.width}),o=Math.round(k.y),r=n.some(function(t){return o===t.y+x});k.isOnPlatform=r,k.velocityX>0?k.velocityX=Math.max(0,k.velocityX-a):k.velocityX<0&&(k.velocityX=Math.min(0,k.velocityX+a)),k.velocityY=Math.max(-X,k.velocityY-a),r&&k.velocityY<0&&(k.velocityY=0),k.x=Math.min(s.width-g,Math.max(0,k.x+k.velocityX));var l=k.velocityY<0&&n.filter(function(t){return k.y>t.y&&k.y+k.velocityY<=t.y})[0];l?(k.y=l.y+x,k.velocityY=0,k.isOnPlatform=!0):k.y+=k.velocityY,k.y<0?(I=!0,h("Game over","rgba(255,0,0,0.8)")):k.y>Y+s.height/2?(I=!0,h("You win!","rgba(30, 255, 30, 0.8")):(y(),requestAnimationFrame(f))}}function u(t){switch(t.keyCode){case 38:k.velocityY=Math.min(k.velocityY+C,X);break;case 40:k.velocityY=Math.max(k.velocityY-C,-X);break;case 37:k.velocityX=Math.max(k.velocityX-C,-X);break;case 39:k.velocityX=Math.min(k.velocityX+C,X)}}var v=!0,s=document.getElementById("game-window"),d=s.getContext("2d"),x=2,g=15;t.prototype.height=x,t.prototype.isPlanet=!1,t.prototype.toString=function(){var t=["(",this.x,"+",this.width,", ",this.y,")"];return this.isPlanet&&t.unshift("Planet:"),t.join("")},t.prototype.getPath=function(){if(this._path)return this._path;for(var t,e=this,i=!this.isPlanet,a=[{x:e.x,y:e.y}],n=e.x,o=e.x+e.width;;){if(n+=Math.max(1,Math.abs(21*Math.cos(n))),n>o)break;t=e.y+3*Math.cos(n)+(i?-4:4),t=i?Math.min(e.y+1,t):Math.max(e.y-1,t),a.push({x:n,y:t})}var r=i?e.y+e.height:e.y-e.height;return a.push({x:o,y:e.y}),a.push({x:o,y:r}),a.push({x:e.x,y:r}),this._path=a,a},t.prototype.draw=function(t){var e=this,i=a(e.y,x,t),n=d.createLinearGradient(e.x,i,e.x+2*e.width/3,2*e.height);n.addColorStop(0,"#887723"),n.addColorStop(1,"#662211"),d.fillStyle=n;var o=e.getPath();d.beginPath(),o.forEach(function(t){d.lineTo(t.x,a(t.y))}),d.fill()};var m=new t(0,.75*s.height-x,s.width);m.isPlanet=!0,m.height=s.height/2;for(var w=[m],p=m,M=1;100>=M;M++){var b=p.y+60+Math.round(100*Math.abs(Math.cos(M)))+2*M,P=60+Math.round(150*Math.abs(Math.sin(M))-1.5*M),T=s.width/2+Math.round(Math.cos(M)*s.width/2)-P/2;p=new t(T,b,P),w.push(p)}var Y=w[w.length-1].y+200,X=10,C=1,S=2.5,k={x:w[0].x+w[0].width/2-g/2,y:w[0].y+x,velocityX:0,velocityY:0,isOnPlatform:!0},D=Date.now(),E=new Image;E.onload=function(){E.loaded=!0},E.src="images/PIA17843.jpg";var I=!1,z=Date.now();s.onclick=function(){I=!I,I?h("Paused","rgba(0,0,255,0.8)"):(z=Date.now(),f())},window.addEventListener("keydown",u,!0),f()}();