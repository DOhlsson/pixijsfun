/* jshint esversion: 6 */

const COLOR_BLACK = 0x000000;
const COLOR_RED = 0xff3300;
const X_PADDING = 16;
const Y_PADDING = 22;

function createHealthBar(entity) {
  //Create the health bar
  let healthBar = new PIXI.Container();
  healthBar.position.set(-5, -22);
  entity.addChild(healthBar);

  //Create the black background rectangle
  let innerBar = new PIXI.Graphics();
  innerBar.beginFill(COLOR_BLACK);
  innerBar.drawRect(0, 0, 40, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front red rectangle
  let outerBar = new PIXI.Graphics();
  outerBar.beginFill(COLOR_RED);
  outerBar.drawRect(0, 0, 40, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;
  healthBar.inner = innerBar;

  entity.healthBar = healthBar;
}

function updateHealthBar(entity, hp) {
  entity.healthBar.outer.width = hp * entity.healthBar.inner.width;
  //moveHealthBar(entity);
}

function moveHealthBar(entity) {
  entity.healthBar.inner.position.x = entity.x - X_PADDING;
  entity.healthBar.inner.position.y = entity.y - Y_PADDING;
  entity.healthBar.outer.position.x = entity.x - X_PADDING;
  entity.healthBar.outer.position.y = entity.y - Y_PADDING;
}
