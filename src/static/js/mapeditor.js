/* jshint esversion: 6 */

let editmode = false;
let textureSelectMode = false;
var textureSelection = 123;
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
  console.log('mousedown', e);
  if (editmode) {
    dragstart = {
      x: tileCoord(e.clientX - container.x),
      y: tileCoord(e.clientY - container.y)
    };
  }
  //if (e.which === 3) {
  //if (editmode && e.which === 1) {
  //} else if (editmode && e.which === 3) {
  //  e.preventDefault();
  //}
});

document.addEventListener('mouseup', function (e) {
  console.log('mouseup', e);
  if (editmode) {
    let newTile;
    if (dragstart) {
      newTile = dragsquare(e);
    }
    if (newTile && e.which === 1) {
      newTile.tile = textureSelection;
      newTile.solid = true;
      socket.emit('newTile', newTile);
    }
    if (newTile && e.which === 3) {
      console.log('delTile', newTile);
      socket.emit('delTile', newTile);
    }
    dragstart = false;
    drawTargetRect({
      x: tileCoord(e.clientX - container.x),
      y: tileCoord(e.clientY - container.y),
      width: 21,
      height: 21
    });
  }
});


