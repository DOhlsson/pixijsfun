/*jshint esversion: 6 */ 
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = module.exports = require('socket.io')(http);
const constants = require('./static/js/common_constants');
const enemy = require('./enemy');
const bullet = require('./bullet');
const Player = require('./player');
const mapgen = require('./mapgen');

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname + "/static" } );
});

app.use(express.static('src/static'));

http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

const spawn = {
  x: 400,
  y: 200
};
const players = {};
const bullets = {};
var bulletId = 0;

const map = mapgen();

// New connection
io.on('connection', function(socket) {
  socket.emit('sendMap', map);

  players[socket.id] = new Player.Player(socket.id, spawn.x, spawn.y);
  let player = players[socket.id];

  socket.on('move', function(msg) {
    player.changeDirection(msg);
  });

  socket.on('jump', function() {
    player.jump();
  });

  socket.on('shoot', function() {
    bullets[bulletId] = new bullet.Bullet(bulletId, player.x, player.y+7, player.facing*10);
    bulletId++;
  });

  socket.on('disconnect', function() {
    console.log('disconnect', socket.id);
    delete players[socket.id];
    console.log(players);
  });
});

function gameLoop() {
  Object.keys(players).forEach(key => {
    let player = players[key];
    player.move(map);
  });

  Object.keys(bullets).forEach(key => {
    let b = bullets[key];
    if(b != undefined) {
      b.emitCoords();
      if(!b.move()) {
        b.emitDestroy();
        bullets[key] = undefined;
      }
    }
  });

  bug.move(map);
}

var bug = new enemy.Ladybug(111, 750, 100);
setInterval(gameLoop, 16);

