if (typeof module !== 'undefined') {
  var constants = require('../../static/js/common_constants');
}

var physics = {
  horizontalMovement: function(entity) {
    if (entity.xvel > 0) {
      if (entity.direction === constants.MOVE_LEFT) {
        entity.facing = -1;
        entity.x -= constants.BASE_WALK_SPEED * entity.xvel;
        if(entity.xvel < 1.0) entity.xvel += 0.05;
      } else if(entity.direction === constants.MOVE_RIGHT) {
        entity.facing = 1;
        entity.x += constants.BASE_WALK_SPEED * entity.xvel;
        if(entity.xvel < 1.0) entity.xvel += 0.05;
      } else if(entity.direction === constants.STOP &&
                entity.xvel > 0) {
        entity.xvel -= 0.1;
        if (entity.xvel < 0) {
          entity.xvel = 0;
        }
      }
    }
  },
  verticalMovement: function(entity) {
    if (entity.jumping) {
      entity.yvel -= 1.5;
      if(entity.yvel < -12) {
        entity.jumping = false;
      }
    }
    if (entity.yvel > 0 || !entity.onGround) {
      entity.yvel += 0.7; // accelerate downwards
      entity.yvel = entity.yvel < 10 ? entity.yvel : 10;
      entity.y += entity.yvel;
    } else if (entity.yvel < 0) { // moving up
      entity.y += entity.yvel;
      entity.onGround = false;
    }
  }
};

if (typeof module !== 'undefined') {
  module.exports = physics;
}

