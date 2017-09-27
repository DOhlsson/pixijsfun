/* jshint esversion: 6 */

const character = require('./character');

class Player extends character.Character {
  constructor(id, x, y) {
    super(id, x, y, "img/bunny_gun.png");
    this.setHeight(37);
    this.setWidth(36);
  }
}

module.exports = {
  Player: Player
};
