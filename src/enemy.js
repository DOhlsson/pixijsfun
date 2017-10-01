/*jshint esversion: 6 */

const io = require('./index');
const character = require('./character');
const entityManager = require('./entityManager');

class Enemy extends character.Character {
  constructor(id, x, y, texture) {
    super(id, x, y, texture);
  }
}

class Ladybug extends Enemy {
  constructor(id, x, y) {
    super(id, x, y, "img/ladybug.png");
    this.setHeight(32);
    this.setWidth(32);

    this.startx = x;
    this.patrol = 1;
    this.damage = 10;
  }

  move(map) {
    this.verticalMovement();

    if(this.x > this.startx+300) {
      this.patrol = -1;
    } else if(this.x < this.startx) {
      this.patrol = 1;
    }

    this.checkPlatforms(map);
    this.emitPosition();

    let col = this.getCollision();
    if(col.length > 0 && col.constructor.name !== 'Ladybug') {
      for(let i = 0; i < col.length; i++) {
        if(col[i].constructor.name !== this.constructor.name) {
          col[i].takeDamage(this.damage);
          this.die();
        }
      }
    }

    this.x += this.patrol;
  }
}

module.exports = {
  Ladybug: Ladybug
};
