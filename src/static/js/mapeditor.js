/* jshint esversion: 6 */

let editmode = false;
let textureSelectMode = false;
let textureSelection = 123;
let dragstart;

let mapeditor_target = new PIXI.Graphics();
mapeditor_target.visible = false;
container.addChild(mapeditor_target);

function toggleEditMode() {
  editmode = !editmode;
  console.log('Edit mode:', editmode);
  mapeditor_target.visible = editmode;
}

function toggleTextureSelect() {
  textureSelectMode = !textureSelectMode;
  console.log('Texture Select Mode:', textureSelectMode);
  textureSelector.visible = textureSelectMode;
}

function tileCoord(n) {
  return Math.floor(n/21)*21;
}

function dragsquare(e) {
  let stopx = tileCoord(e.clientX - container.x);
  let stopy = tileCoord(e.clientY - container.y);
  return {
    x: Math.min(dragstart.x, stopx),
    y: Math.min(dragstart.y, stopy),
    width: 21 + Math.abs(tileCoord(dragstart.x - stopx)),
    height: 21 + Math.abs(tileCoord(dragstart.y - stopy))
  };
}

function drawTargetRect(rect) {
  mapeditor_target.clear();
  mapeditor_target.lineStyle(2, 0x444444);
  mapeditor_target.drawRect(rect.x, rect.y, rect.width, rect.height);
}

// Prevent right-click menu from appearing
window.oncontextmenu = function (e) {
  e.preventDefault();
};

document.addEventListener('mousemove', function (e) {
  if (editmode && !dragstart) {
    drawTargetRect({
      x: tileCoord(e.clientX - container.x),
      y: tileCoord(e.clientY - container.y),
      width: 21,
      height: 21
    });
  } else if (editmode && dragstart) {
    let sq = dragsquare(e);
    drawTargetRect(sq);
  }
});

document.addEventListener('mousedown', function (e) {
  if (editmode && e.which === 1) {
    dragstart = {
      x: tileCoord(e.clientX - container.x),
      y: tileCoord(e.clientY - container.y)
    };
  } else if (editmode && e.which === 3) {
    e.preventDefault();
    console.log('mousedown', e);
  }
});

document.addEventListener('mouseup', function (e) {
  if (editmode && dragstart && e.which === 1) {
    var newTile = dragsquare(e);
    newTile.tile = textureSelection;
    newTile.solid = true;
    socket.emit('newTile', newTile);
    dragstart = false;
    drawTargetRect({
      x: tileCoord(e.clientX - container.x),
      y: tileCoord(e.clientY - container.y),
      width: 21,
      height: 21
    });
  }
});

