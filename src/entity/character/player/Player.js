/* jshint esversion: 6 */

const character = require('../Character');

class Player extends character.Character {
  constructor(id, x, y, socket) {
    super(id, x, y, "img/bunny_gun.png");
    this.setHeight(37);
    this.setWidth(36);

    this.spawnx = x;
    this.spawny = y;
    this.socket = socket;
    this.maxhp = 100;
    this.hitpoints = this.maxhp;
  }

  die() {
    this.x = this.spawnx;
    this.y = this.spawny;
    this.hitpoints = this.maxhp;
    this.emitPosition();
  }
}

module.exports = {
  Player: Player
};
