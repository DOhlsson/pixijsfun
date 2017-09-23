
var socket = io();
var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
var spritesheet = PIXI.BaseTexture.fromImage("spritesheet_2.png");
var ground1 = new PIXI.Texture(spritesheet, new PIXI.Rectangle(72, 95, 21, 21));
//var ground1 = new PIXI.Texture.fromImage('spritesheet_2.png');
document.body.appendChild(app.view);
var tilingSprite = new PIXI.extras.TilingSprite(
  ground1, 
  200,
  300,
);
tilingSprite.position.x = 300;
tilingSprite.position.y = 300;
app.stage.addChild(tilingSprite);

var bunnys = [];
var myid;

// create a new Sprite from an image path
//var bunny = PIXI.Sprite.fromImage('bunny.png')
//
//// center the sprite's anchor point
//bunny.anchor.set(0.5);
//
//// move the sprite to the center of the screen
//bunny.x = app.renderer.width / 2;
//bunny.y = app.renderer.height / 2;
//

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

socket.on('coords', function (msg) {
  console.log('got', msg);
  if (!bunnys[msg.id]) {
    console.log('NEW BUNNY');
    newbunny(msg);
  } else {
    bunnys[msg.id].x = msg.x;
    bunnys[msg.id].y = msg.y;
  }
});

document.addEventListener('keydown', function(event) {
  if (event.keyCode == 37) {    // LEFT
    move(-10, 0);
  } else if (event.keyCode == 38) { // UP
    socket.emit('jump', undefined);
//        move(0, -10);
  } else if (event.keyCode == 39) { // RIGHT
    move(10, 0);
//      } else if (event.keyCode == 40) { // DOWN
//        move(0, 10);
  } else {
    console.log('keycode', event.keyCode);
  }
});

function move(x, y) {
  socket.emit('move', {
    x: bunnys[myid].x + x,
    y: bunnys[myid].y + y
  });
}
