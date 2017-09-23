const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname + "/static" } );
});

/*
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
*/

http.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.use(express.static('src/static'))

let x = 400;
let y = 300;
let users = [];

io.on('connection', function(socket) {
  socket.on('move', function(msg) {
    users[socket.id] = {
      x: msg.x,
      y: msg.y
    };
    io.emit('coords', {y, x, id: socket.id});
    console.log(socket.id + ' sent ' + JSON.stringify(msg, null, 2));
  });
  socket.on('jump', function() {
    console.log('we got jump');
  });

  socket.on('disconnect', function() {
    console.log('disconnect', socket.id);
  });
});

function gameLoop() {
}

setInterval(gameLoop, 100);
