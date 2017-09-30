/* jshint esversion: 6 */

const character = require('./character');

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
    this.updatehp();
  }

  die() {
    this.x = this.spawnx;
    this.y = this.spawny;
    this.hitpoints = this.maxhp;
    this.emitPosition();
  }

  updatehp() {
    this.socket.emit('hp', this.hitpoints / this.maxhp);
  }

  takeDamage(dmg) {
    super.takeDamage(dmg);
    this.updatehp();
  }
}

module.exports = {
  Player: Player
};
