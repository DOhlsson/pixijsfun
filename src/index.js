/* jshint esversion: 6 */ 
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = module.exports = require('socket.io')(http);
const constants = require('./static/js/common_constants');
const enemy = require('./enemy');
const bullet = require('./bullet');
const Player = require('./player');
const mapgen = require('./mapgen');
const EntityManager = require('./entityManager.js');

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

const entityManager = new EntityManager();

const map = mapgen();

// New connection
io.on('connection', function(socket) {
  socket.emit('sendMap', map);

  let id = socket.id;
  entityManager.addEntity(id, new Player.Player(id, spawn.x, spawn.y));
  let player = entityManager.getEntity(id);

  socket.on('move', function(msg) {
    player.changeDirection(msg);
  });

  socket.on('jump', function() {
    player.jump();
  });

  socket.on('shoot', function() {
    let bulletId = entityManager.getFreeId();
    entityManager.addEntity(bulletId, new bullet.Bullet(bulletId, player.x, player.y+7, player.facing*10));
  });

  socket.on('spawnBugs', function(x) {
    for(let i = 0; i < 5; i++) {
      let id = entityManager.getFreeId();
      entityManager.addEntity(id, new enemy.Ladybug(id, x+(i*200), 100));
    }
  });

  socket.on('disconnect', function() {
    console.log('disconnect', socket.id);
    entityManager.deleteEntity(id);
  });
});

function gameLoop() {
  Object.keys(entityManager.getEntities()).forEach(key => {
    let entity = entityManager.getEntities()[key];
    if(entity.delete) {
      entityManager.deleteEntity(key);
    }

    let col = entityManager.getCollision(entity);
    if(col !== undefined) {
      if(col.constructor.name === 'Ladybug' && entity.constructor.name === 'Bullet') {
        console.log('Killed ladybug');
        col.emitDestroy();
        entity.emitDestroy();
        col.delete = true;
        entity.delete = true;
      }
    }
    if (!entity.delete) {
      entity.move(map);
    }
  });
}

setInterval(gameLoop, 16);

