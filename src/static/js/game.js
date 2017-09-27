/*jshint esversion: 6 */ 

var socket = io();
var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});

document.body.appendChild(app.view);

var bunny_texture = PIXI.Texture.fromImage("img/bunny_gun.png");

var spritesheet = PIXI.BaseTexture.fromImage("img/spritesheet_2.png");
var ground1 = new PIXI.Texture(spritesheet, new PIXI.Rectangle(72, 95, 21, 21));
var ground2 = new PIXI.Texture(spritesheet, new PIXI.Rectangle(49, 118, 21, 21));
let rocket_frames = [];
let spHead_frames = [];

sounds.load([
  'sound/40_smith_wesson_single-mike-koenig.mp3'
]);

var shootSound = sounds["sound/40_smith_wesson_single-mike-koenig.mp3"];

// container contains most items we draw
// we move the camera by moving around the container
// items that are added to app.stage are static on the screen
// and do not move with the camera
container = new PIXI.Container();
app.stage.addChild(container);

PIXI.loader.add('img/rocket.json').add('img/spinning_head.json').load(() => {
  // Rocket
  for ( let i = 0; i <= 3; i++) {
    rocket_frames.push(PIXI.Texture.fromFrame('rocket' + i + '.png'));
  }
  let rocket_animation = new PIXI.extras.AnimatedSprite(rocket_frames);
  rocket_animation.animationSpeed = 0.3;
  rocket_animation.play();
  container.addChild(rocket_animation);
  app.ticker.add(() => {
    rocket_animation.x += 5;
  });

  // Spinning head
  for ( let i = 0; i <= 9; i++) {
    spHead_frames.push(PIXI.Texture.fromFrame('spinning_head' + i + '.png'));
  }
  let spHead_animation = new PIXI.extras.AnimatedSprite(spHead_frames);
  spHead_animation.animationSpeed = 0.2;
  spHead_animation.play();
  container.addChild(spHead_animation);

  spHead_animation.y = 125;
  spHead_animation.scale.x = 2;
  spHead_animation.scale.y = 2;
  app.ticker.add(() => {
    spHead_animation.x += 3;
    spHead_animation.y = 60 + Math.round(50*Math.sin(spHead_animation.x/180*Math.PI));
  });
});

var camtrap = {
  x: 300,
  y: 200,
  relx: 300,
  rely: 200,
  width: 200,
  height: 200
};

// Used to display the camtrap
var camtrapg = new PIXI.Graphics();
camtrapg.lineStyle(2, 0xFF0000);
camtrapg.drawRect(0, 0, 200, 200);
camtrapg.y = camtrap.y;
camtrapg.x = camtrap.x;
container.addChild(camtrapg);
console.log('CAMTRAPG', camtrapg.y, camtrapg.position.y);

function moveCamera() {
  var mybunny = entities[myid];
  var scrollvel = 10;

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

var entities = [];
var myid;

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

socket.on('createEntity', function (msg) {
  newEntity(msg);

  if (msg.id === myid) {
    moveCamera();
  }
});


function newEntity(msg) {
  let entity = new PIXI.Container();

  let tmpTexture = new PIXI.Sprite(PIXI.Texture.fromImage(msg.texture));
  entity.addChild(tmpTexture);
  entity.texture = tmpTexture; // store a reference for easier access
  entity.x = msg.x;
  entity.y = msg.y;

  entities[msg.id] = entity;
  container.addChild(entity);
}

socket.on('entityPos', function (msg) {
  if (!entities[msg.id]) {
    console.log('NEW BUNNY');
    newEntity(msg);
  } else {
    let entity = entities[msg.id];
    entity.x = msg.x;
    entity.y = msg.y;
    // bunny.bunny is the sprite inside the container
    // we flip it with scale.x = 1 or -1
    // and change the x offset of the sprite inside the container
    entity.texture.scale.x = msg.facing;
    entity.texture.x = msg.facing === 1 ? 0 : 26;
  }

  if (msg.id === myid) {
    moveCamera();
  }
});

socket.on('bullet', function(msg) {
  if (!entities[msg.id]) {
    console.log('NEW BULLET');
    newEntity(msg);

    shootSound.play();
  } else {
    let bullet = entities[msg.id];
    bullet.x = msg.x;
    bullet.y = msg.y;
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
      moveRight = keyboard(KEY_RIGHT),
      shoot = keyboard(KEY_CTRL);

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

  shoot.press = function() {
    socket.emit('shoot', undefined);
  };

});
