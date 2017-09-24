/*jshint esversion: 6 */ 
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname + "/static" } );
});

app.use(express.static('src/static'));

http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

const bunny = {
  height: 26,
  width: 37
};
const spawn = {
  x: 400,
  y: 200
};
const players = {};

const map = [{
  x: 300,
  y: 300,
  height: 400,
  width: 300
}, {
  x: 100,
  y: 200,
  height: 400,
  width: 200
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
    y: spawn.y
  };
  emitCoords(players[socket.id]);

  socket.on('move', function(msg) {
    players[socket.id].x = msg.x;
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
  }
  if (player.yvel < 0) { // moving up
    player.y += player.yvel;
    player.onGround = false;
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
    onGround = false;
  }
}

function gameLoop() {
  Object.keys(players).forEach(key => {
    var player = players[key];
    verticalMovement(player);
  });
}

setInterval(gameLoop, 16);
