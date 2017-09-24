/*jshint esversion: 6 */ 
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const constants = require('./static/js/common_constants');

const BASE_SPEED = 10;

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname + "/static" } );
});

app.use(express.static('src/static'));

http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

const bunny = {
  height: 37,
  width: 26
};
const spawn = {
  x: 400,
  y: 200
};
const players = {};

const map =[{
  x: 294,
  y: 294,
  height: 21,
  width: 294,
  tile: 1
}, {
  x: 294,
  y: 315,
  height: 378,
  width: 294,
  tile: 2
}, {
  x: 105,
  y: 189,
  height: 21,
  width: 189,
  tile: 1
}, {
  x: 105,
  y: 210,
  height: 399,
  width: 189,
  tile: 2
}];

function emitCoords(player) {
  io.emit('coords', {
    id: player.id,
    x: player.x,
    y: player.y
  });
}

// New connection
io.on('connection', function(socket) {
  socket.emit('sendMap', map);

  players[socket.id] = {
    id: socket.id,
    x: spawn.x,
    y: spawn.y,
    velocity: 0,
    direction: 0
  };
  emitCoords(players[socket.id]);

  socket.on('move', function(msg) {
    if(msg === constants.MOVE_RIGHT) {
      if(players[socket.id].direction === constants.MOVE_RIGHT) {
        if(players[socket.id].velocity <= 1) {
          players[socket.id].velocity += 0.1;
        }
      } else {
        players[socket.id].velocity = 0.5;
        players[socket.id].direction = constants.MOVE_RIGHT;
      }

      players[socket.id].x += BASE_SPEED * players[socket.id].velocity;
    } else if(msg === constants.MOVE_LEFT) {
      if(players[socket.id].direction === constants.MOVE_LEFT) {
        if(players[socket.id].velocity <= 1) {
          players[socket.id].velocity += 0.5;
        }
      } else {
        players[socket.id].velocity = 0.1;
        players[socket.id].direction = constants.MOVE_LEFT;
      }
      players[socket.id].x -= BASE_SPEED * players[socket.id].velocity;
    }
    //players[socket.id].x = msg.x;
    emitCoords(players[socket.id]);
    console.log(socket.id + ' sent ' + JSON.stringify(msg, null, 2));
  });

  socket.on('jump', function() {
    console.log('we got jump');
    var player = players[socket.id];
    if (player.onGround) {
      player.yvel = -10;
    }
  });

  socket.on('disconnect', function() {
    console.log('disconnect', socket.id);
    delete players[socket.id];
    console.log(players);
  });
});

function verticalMovement(player) {
  if (player.yvel > 0 || !player.onGround) {
    player.yvel += 0.7; // accelerate downwards
    player.yvel = player.yvel < 10 ? player.yvel : 10;
    player.y += player.yvel;
    checkPlatforms(player);
    emitCoords(player);
  } else if (player.yvel < 0) { // moving up
    player.y += player.yvel;
    player.onGround = false;
    emitCoords(player);
  }
}

function checkPlatforms(player) {
  onGround = false;
  map.forEach(rect => {
    if (player.y >= rect.y - bunny.height &&
      player.y <= rect.y + rect.height - bunny.height &&
      player.x >= rect.x - bunny.width + 5 &&	// fall of on left side
      player.x <= rect.x + rect.width - 5 ) {	// fall of on right side
      player.yvel = 0;
      player.onGround = true;
      onGround = true;
      player.y = rect.y - bunny.height;
    }
  });
  if (!onGround) {
    player.onGround = false;
  }
}

function gameLoop() {
  Object.keys(players).forEach(key => {
    var player = players[key];
    verticalMovement(player);
  });
}

setInterval(gameLoop, 16);
