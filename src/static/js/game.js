/*jshint esversion: 6 */ 

var socket = io();
var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});

document.body.appendChild(app.view);

var spritesheet = PIXI.BaseTexture.fromImage("spritesheet_2.png");
var ground1 = new PIXI.Texture(spritesheet, new PIXI.Rectangle(72, 95, 21, 21));
var ground2 = new PIXI.Texture(spritesheet, new PIXI.Rectangle(49, 118, 21, 21));

container = new PIXI.Container();
app.stage.addChild(container);

// the camera trap defines an area in which the camera will not scroll unnecesarily
//camtrap = new PIXI.Rectangle(200, 200, 200, 200);
//setInterval(() => {
//  camtrap.y += 10;
//  camtrapg.y += 10;
//}, 1000);

var camtrap = {
  x: 300,
  y: 200,
  relx: 300,
  rely: 200,
  width: 200,
  height: 200
}
// Used to display the camtrap
var camtrapg = new PIXI.Graphics();
camtrapg.lineStyle(2, 0xFF0000);
camtrapg.drawRect(0, 0, 200, 200);
camtrapg.y = camtrap.y;
camtrapg.x = camtrap.x;
container.addChild(camtrapg);
console.log('CAMTRAPG', camtrapg.y, camtrapg.position.y);

function moveCamera() {
  var mybunny = bunnys[myid];
  var scrollvel = 10;

  console.log('bunny', mybunny.x, mybunny.y);
  console.log('camtrap', camtrap.x, camtrap.y);
  console.log('container', container.position.x, container.position.y);

  // horizontal scroll
  if (mybunny.x + mybunny.width > camtrap.x + camtrap.width) { // scroll right
    container.position.x = camtrap.relx - camtrap.x;
    camtrap.x = mybunny.x - camtrap.width + mybunny.width;
  } else if (mybunny.x < camtrap.x) { // scroll left
    container.position.x = camtrap.relx - camtrap.x;
    camtrap.x = mybunny.x;
  }

  // vertical scroll
  if (mybunny.y < camtrap.y) { // Scroll up
    container.position.y = camtrap.rely - camtrap.y;
    camtrap.y = mybunny.y;
  } else if (mybunny.y + mybunny.height > camtrap.y + camtrap.height) { // scroll down
    container.position.y = camtrap.rely - camtrap.y;
    camtrap.y = mybunny.y - camtrap.height + mybunny.height;
  }

  camtrapg.y = camtrap.y;
  camtrapg.x = camtrap.x;
}

var bunnys = [];
var myid;

function newbunny(msg) {
  console.log('socket.id', socket.id);
  let newguy = PIXI.Sprite.fromImage('bunny.png');
  newguy.x = msg.x;
  newguy.y = msg.y;

  bunnys[msg.id] = newguy;
  container.addChild(newguy);
}

socket.on('connect', function () {
  myid = socket.id;
  console.log('myid', myid);
});

socket.on('sendMap', function (map) {
  console.log('gotmap', map);
  map.forEach(rect => {
    var sprite;
    if (rect.tile == 2) {
      sprite = ground2;
    } else {
      sprite = ground1;
    }
    var tilingSprite = new PIXI.extras.TilingSprite(sprite, rect.width, rect.height);
    tilingSprite.position.x = rect.x;
    tilingSprite.position.y = rect.y;
    container.addChild(tilingSprite);
  });
});


socket.on('coords', function (msg) {
  if (!bunnys[msg.id]) {
    console.log('NEW BUNNY');
    newbunny(msg);
  } else {
    bunnys[msg.id].x = msg.x;
    bunnys[msg.id].y = msg.y;
  }
  if (msg.id === myid) {
    moveCamera();
  }
});

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

document.addEventListener('DOMContentLoaded', function () {
  var jump = keyboard(KEY_UP),
      moveLeft = keyboard(KEY_LEFT),
      moveRight = keyboard(KEY_RIGHT);

  jump.press = function() {
    socket.emit('jump', undefined);
  };

  jump.release = function() {
    socket.emit('move', STOP_JUMP);
  };

  moveLeft.press = function() {
    socket.emit('move', MOVE_LEFT);
  };

  moveLeft.release = function() {
    socket.emit('move', STOP_LEFT);
  };

  moveRight.press = function() {
    socket.emit('move', MOVE_RIGHT);
  };

  moveRight.release = function() {
    socket.emit('move', STOP_RIGHT);
  };
});
