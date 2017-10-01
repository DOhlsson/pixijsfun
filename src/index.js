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
const EntityManager = require('./entityManager');
const Grenade = require('./grenade');

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
const locks = {};

// New connection
io.on('connection', function(socket) {
  socket.emit('sendMap', map);

  let id = socket.id;
  entityManager.addEntity(id, new Player.Player(id, spawn.x, spawn.y, socket));
  let player = entityManager.getEntity(id);

  socket.on('move', function(msg) {
    player.changeDirection(msg);
  });

  socket.on('jump', function() {
    player.jump();
  });

  socket.on('shoot', function(owner) {
    let bulletId = entityManager.getFreeId();
    entityManager.addEntity(bulletId, new bullet.Bullet(bulletId, player.x, player.y+7, player.facing*10, owner));
  });

  socket.on('grenade', function(owner) {
    let grenadeId = entityManager.getFreeId();
    entityManager.addEntity(grenadeId, new Grenade(grenadeId, player.x, player.y+7, player.facing*10, owner));
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

  socket.on('newTile', function(newTile) {
    map.push(newTile);
    socket.emit('sendMap', [newTile]);
  });
});

function gameLoop() {
  Object.keys(entityManager.getEntities()).forEach(key => {
    setTimeout ( function() {
      while(locks[key] !== undefined);
      locks[key] = true;

      let entity = entityManager.getEntities()[key];
      if(entity === undefined) {
        entityManager.deleteEntity(key);
      } else {
        if(entity.delete) {
          entityManager.deleteEntity(key);
        }

        /*let col = entityManager.getCollision(entity);
        if(col !== undefined) {
          entity.takeDamage(col.damage);
          col.takeDamage(entity.damage);
        }*/
        if (!entity.delete) {
          entity.move(map);
        }
      }
      delete locks[key];
    }, 50);
  });
}

setInterval(gameLoop, 16);

