/* jshint esversion: 6 */

const entity = require('../Entity');
const constants = require('../../static/js/common_constants');
const networking = require('../../networking');
const physics = require('../../static/js/physics');

class Character extends entity.Entity {
  constructor(id, x, y, texture) {
    super(id, x, y, texture, 32, 32);
    this.direction = 0;
    this.last_direction = 0;
    this.xvel = 0;
    this.xvel = 0;
    this.jumping = false;
    this.facing = 1;
    this.onGround = false;

    this.emitCreate();
    this.emitHealthPoints();
  }

  getFacing() {
    return this.facing;
  }

  changeDirection(direction) {
    if(direction=== constants.MOVE_RIGHT) {
      this.xvel = 0.1;
      this.direction = constants.MOVE_RIGHT;
    } else if(direction === constants.MOVE_LEFT) {
      this.xvel = 0.1;
      this.direction = constants.MOVE_LEFT;
    } else if(direction === constants.STOP_RIGHT &&
      this.direction === constants.MOVE_RIGHT) {
      this.direction = constants.STOP;
    } else if(direction === constants.STOP_LEFT &&
      this.direction === constants.MOVE_LEFT) {
      this.direction = constants.STOP;
    } else if(direction === constants.STOP_JUMPING) {
      this.jumping = false;
    }
  }

  jump() {
    if(this.onGround) {
      this.yvel = -10;
      this.jumping = true;
      this.emitPosition(true);
    }
  }

  checkPlatforms(map) {
    let onGround = false;
    map.forEach(rect => {
      if (rect.solid &&
          this.y >= rect.y - this.height &&
          this.y <= rect.y + rect.height - this.height &&
          this.x >= rect.x - this.width + 5 &&	// fall of on left side
          this.x <= rect.x + rect.width - 5 ) {	// fall of on right side
        this.yvel = 0;
        this.onGround = true;
        onGround = true;
        this.y = rect.y - this.height;
        this.emitPosition(true);
      }
    });
    if (!onGround) {
      this.onGround = false;
    }
  }

  emitHealthPoints() {
    networking.addPackage({
      type: "hp",
      id: this.id,
      hp: this.hitpoints / this.maxhp
    });
  }


  takeDamage(dmg) {
    super.takeDamage(dmg);
    this.emitHealthPoints();
  }

  move(map) {
    let tmpX = this.x;
    let tmpY = this.y;
    let tmpHp = this.hitpoints;

    physics.horizontalMovement(this);
    physics.verticalMovement(this);
    this.checkPlatforms(map);

    // TODO refactor into this.hasmoved?
    if(tmpX != this.x || tmpY != this.y || tmpHp != this.hitpoints) {
      this.emitHealthPoints();
    }
  }
}

module.exports = {
  Character: Character
};
