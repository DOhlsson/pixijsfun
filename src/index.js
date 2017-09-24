/*jshint esversion: 6 */ 
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const constants = require('./static/js/common_constants');
const mapgen = require('./mapgen');

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

const map = mapgen();

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
    direction: 0,
    last_direction: 0,
    yvel: 0,
    xvel: 0,
    jumping: false
  };
  emitCoords(players[socket.id]);

  var player = players[socket.id];

  socket.on('move', function(msg) {
    if(msg === constants.MOVE_RIGHT) {
      player.xvel = 0.1;
      player.direction = constants.MOVE_RIGHT;
    } else if(msg === constants.MOVE_LEFT) {
      player.xvel = 0.1;
      player.direction = constants.MOVE_LEFT;
    } else if(msg === constants.STOP_RIGHT &&
             player.direction === constants.MOVE_RIGHT) {
      player.direction = constants.STOP;
    } else if(msg === constants.STOP_LEFT &&
             player.direction === constants.MOVE_LEFT) {
      player.direction = constants.STOP;
    } else if(msg === constants.STOP_JUMPING) {
      player.jumping = false;
    }
  });

  socket.on('jump', function() {
    if (player.onGround) {
      player.yvel = -10;
      player.jumping = true;
    }
  });

  socket.on('disconnect', function() {
    console.log('disconnect', socket.id);
    delete players[socket.id];
    console.log(players);
  });
});

function verticalMovement(player) {
  if (player.jumping) {
    player.yvel -= 1.5;
    if(player.yvel < -12) {
      player.jumping=false;
    }
  }
  if (player.yvel > 0 || !player.onGround) {
    player.yvel += 0.7; // accelerate downwards
    player.yvel = player.yvel < 10 ? player.yvel : 10;
    player.y += player.yvel;
  } else if (player.yvel < 0) { // moving up
    player.y += player.yvel;
    player.onGround = false;
  }
}

function horizontalMovement(player) {
  if (player.xvel > 0) {
    if (player.direction === constants.MOVE_LEFT) {
      player.x -= BASE_SPEED * player.xvel;
      if(player.xvel < 1.0) player.xvel += 0.05;
    } else if(player.direction === constants.MOVE_RIGHT) {
      player.x += BASE_SPEED * player.xvel;
      if(player.xvel < 1.0) player.xvel += 0.05;
    } else if(player.direction === constants.STOP &&
              player.xvel > 0) {
      player.xvel -= 0.1;
    }
  }
}

function checkPlatforms(player) {
  onGround = false;
  map.forEach(rect => {
    if (rect.tile == 1 &&
      player.y >= rect.y - bunny.height &&
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
    horizontalMovement(player);
    checkPlatforms(player);
    emitCoords(player);
  });
}

setInterval(gameLoop, 16);
