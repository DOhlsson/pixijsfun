/* jshint esversion: 6 */ 

const io = require('./index');

var queue = [];

function addPackage(pkg) {
  queue.push(pkg);
}

function sendPackages(tick) {
  let localQueue = [];
  let p = queue.shift();
  while(p !== undefined) {
    localQueue.push(p);
    p = queue.shift();
  }

  if(localQueue.length > 0) {
    var tickmsg = {
      type: 'tick',
      val: tick
    };
    localQueue.push(tickmsg);
    console.log('sending', localQueue.length);
    console.log('like', localQueue[0]);
    io.emit('entities', {
      queue: localQueue
    });
  }
}

//setInterval(sendPackages, 30);

module.exports = {
  addPackage: addPackage,
  sendPackages: sendPackages
};
