/* jshint esversion: 6 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = module.exports = require('socket.io')(http);
const fs = require('fs');

const constants = require('./static/js/common_constants');
const enemy = require('./entity/character/enemy/Enemy');
const bullet = require('./entity/bullet/Bullet');
const Player = require('./entity/character/player/Player');
const mapgen = require('./mapgen');
const entityManager = require('./entityManager');
const Grenade = require('./entity/grenade/Grenade');
const networking = require('./networking');


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

let map = mapgen();
const locks = {};

// New connection
io.on('connection', function(socket) {
  socket.emit('newMap', map);

  let id = socket.id;
  entityManager.addEntity(id, new Player.Player(id, spawn.x, spawn.y, socket));
  let player = entityManager.getEntityById(id);

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
    entityManager.deleteEntityById(id);
  });

  socket.on('newTile', function(newTile) {
    let tilesW = newTile.width/21;
    let tilesH = newTile.height/21;
    let newtiles = [];
    for (let i = 0; i < tilesW; i++) {
      for (let j = 0; j < tilesH; j++) {
        let pieceTile = {
          x: newTile.x + i * 21,
          y: newTile.y + j * 21,
          width: 21,
          height: 21,
          solid: newTile.solid,
          tile: newTile.tile
        };
        newtiles.push(pieceTile);
        map.push(pieceTile);
      }
    }

    socket.emit('sendMap', newtiles);
  });

  socket.on('delTile', function(delTile) {
    var prelen = map.length;
    var del = 0;
    var delList = [];
    var newmap = [];
    map.forEach((tile, i) => {
      console.log('i', i);
      if (delTile.x <= tile.x && delTile.x + delTile.width >= tile.x + tile.width &&
          delTile.y <= tile.y && delTile.y + delTile.height >= tile.y + tile.height) {
        del++;
      } else {
        newmap.push(tile);
      }
    });
    console.log('prelen', prelen);
    console.log('len', map.length);
    if (del) {
      console.log('' + del, 'to delete');
      socket.emit('delMap', delTile);
    }
    map = newmap;

  });

  socket.on('savemap', function (msg) {
    console.log('savemap', msg);
    fs.writeFile('src/maps/' + msg + '.json', JSON.stringify(map, null, 2), (err) => {
      if (!err) {
        console.log('success');
      } else {
        console.log('error', err);
      }
    });
  });

  socket.on('loadmap', function (msg) {
    console.log('loadmap', msg);
    fs.readFile('src/maps/' + msg + '.json', 'utf8', (err, data) => {
      if (!err) {
        console.log('success');
        map = JSON.parse(data);
        socket.emit('newMap', map);
      } else {
        console.log('error', err);
      }
    });
  });
});

let tick = 0;
function gameLoop() {
  tick++;
  let t = new Date();
  if (tick % 6 == 0) {
    networking.clear();
  }
  Object.keys(entityManager.getEntities()).forEach(key => {
    //setTimeout ( function() {
      //while(locks[key] !== undefined);
      //locks[key] = true;

      let entity = entityManager.getEntities()[key];
      if(entity === undefined) {
        entityManager.deleteEntityById(key);
      } else {
        if(entity.delete) {
          entityManager.deleteEntityById(key);
        }

        if (!entity.delete) {
          entity.move(map);
        }
      }
      //delete locks[key];
    //}, 50);
  });
  if (tick % 6 == 0) {
    networking.sendPackages(tick);
  }
  let time = new Date() - t;
  if (time > 16) {
    console.log('can\'t keep up!');
  }
  setTimeout(gameLoop, Math.max(0, 16 - time));
}

gameLoop();

