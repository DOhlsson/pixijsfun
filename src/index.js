const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname + "/static" } );
});

app.use(express.static('src/static'))

http.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

const spawn = {
  x: 400,
  y: 200
};
const players = {};

function emitCoords(player) {
  io.emit('coords', {
    id: player.id,
    x: player.x,
    y: player.y
  });
}

// New connection
io.on('connection', function(socket) {
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
  });

  socket.on('disconnect', function() {
    console.log('disconnect', socket.id);
    delete players[socket.id];
    console.log(players);
  });
});

function gameLoop() {
  Object.keys(players).forEach(key => {
    var player = players[key];
    player.y += 2;
    emitCoords(player);
  });
}

setInterval(gameLoop, 1000);
