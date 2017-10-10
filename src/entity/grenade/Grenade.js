/* jshint esversion: 6 */

const io = require('../../index');
const entity = require('../Entity');
const networking = require('../../networking');
const entityManager = require('../../entityManager');

module.exports = class Grenade extends entity.Entity {
  constructor(id, x, y, xvel, owner) {
    super(id, x, y, "img/bullet.png");
    this.xvel = xvel;
    this.range = this.x + xvel * 60;
    this.damage = 100;
    this.owner = owner;
    this.sound = 'sound/Grenade-SoundBible.com-1777900486.mp3';
    this.i = 1;
    this.starty = this.y;
    this.onGround = false;
    this.height = 2;
    this.width = 2;
  }

  checkPlatforms(map) {
    let onGround = false;
    map.forEach(rect => {
      if (rect.tile == 1 &&
          this.y >= rect.y - this.height &&
          this.y <= rect.y + rect.height - this.height &&
          this.x >= rect.x - this.width + 5 &&	// fall of on left side
          this.x <= rect.x + rect.width - 5 ) {	// fall of on right side
          this.yvel = 0;
        this.onGround = true;
        onGround = true;
      }
    });
    if (!onGround) {
      this.onGround = false;
    }
  }

  move(map) {
    this.x += this.xvel;
    this.y = this.starty + ( 10 * Math.round(Math.sin(this.i)*-10));
    this.i += Math.PI / 60;
    this.emitPosition();

    this.height = 50;
    this.width = 50;
    let col = this.getCollision();
    if(col.length > 0) {
      for(let i = 0; i < col.length; i++) {
        if(col[i].id !== this.owner) {
          col[i].takeDamage(this.damage);
        }
      }
    }

   if((this.range < 0 && this.x < this.range) ||
       this.range > 0 && this.x > this.range) {
      this.explode();
    }

    this.height = 2;
    this.width = 2;
    this.checkPlatforms(map);
    if(this.onGround == true) {
      this.height = 50;
      this.width = 50;

      this.explode();
    }
  }

  explode() {
    networking.addPackage({
      type: "sound",
      file: this.sound
    });
    this.die();
  }
};
