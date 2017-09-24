var socket = io();
var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});

document.body.appendChild(app.view);

var spritesheet = PIXI.BaseTexture.fromImage("spritesheet_2.png");
var ground1 = new PIXI.Texture(spritesheet, new PIXI.Rectangle(72, 95, 21, 21));

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
    var tilingSprite = new PIXI.extras.TilingSprite(ground1, rect.width, rect.height);
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

document.addEventListener('keydown', function(event) {
  if (event.keyCode == 37) {    // LEFT
    move(-10, 0);
  } else if (event.keyCode == 38) { // UP
    socket.emit('jump', undefined);
  } else if (event.keyCode == 39) { // RIGHT
    move(10, 0);
  } else {
    console.log('keycode', event.keyCode);
  }
});

function move(x, y) {
  socket.emit('move', {
    x: bunnys[myid].x + x
  });
}
