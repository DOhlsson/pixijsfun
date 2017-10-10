/* jshint esversion: 6 */

const entity = require('../Entity');
const constants = require('../../static/js/common_constants');

const BASE_SPEED = 10;

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
    }
  }

  verticalMovement() {
    if (this.jumping) {
      this.yvel -= 1.5;
      if(this.yvel < -12) {
        this.jumping=false;
      }
    }
    if (this.yvel > 0 || !this.onGround) {
      this.yvel += 0.7; // accelerate downwards
      this.yvel = this.yvel < 10 ? this.yvel : 10;
      this.y += this.yvel;
    } else if (this.yvel < 0) { // moving up
      this.y += this.yvel;
      this.onGround = false;
    }
  }

  horizontalMovement() {
    if (this.xvel > 0) {
      if (this.direction === constants.MOVE_LEFT) {
        this.facing = -1;
        this.x -= BASE_SPEED * this.xvel;
        if(this.xvel < 1.0) this.xvel += 0.05;
      } else if(this.direction === constants.MOVE_RIGHT) {
        this.facing = 1;
        this.x += BASE_SPEED * this.xvel;
        if(this.xvel < 1.0) this.xvel += 0.05;
      } else if(this.direction === constants.STOP &&
                this.xvel > 0) {
        this.xvel -= 0.1;
      }
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
      }
    });
    if (!onGround) {
      this.onGround = false;
    }
  }

  move(map) {
    this.verticalMovement();
    this.horizontalMovement();
    this.checkPlatforms(map);
    this.emitPosition();
  }
}

module.exports = {
  Character: Character
};
