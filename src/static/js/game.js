/*jshint esversion: 6 */ 

var socket = io();
var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});

document.body.appendChild(app.view);

var spritesheet = PIXI.BaseTexture.fromImage("spritesheet_2.png");
var ground1 = new PIXI.Texture(spritesheet, new PIXI.Rectangle(72, 95, 21, 21));
var ground2 = new PIXI.Texture(spritesheet, new PIXI.Rectangle(49, 118, 21, 21));

var bunnys = [];
var myid;

function newbunny(msg) {
  console.log('socket.id', socket.id);
  let newguy = PIXI.Sprite.fromImage('bunny.png');
  newguy.x = msg.x;
  newguy.y = msg.y;

  bunnys[msg.id] = newguy;
  app.stage.addChild(newguy);
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
    app.stage.addChild(tilingSprite);
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
