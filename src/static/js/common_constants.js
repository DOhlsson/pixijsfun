/*jshint esversion: 6 */

var constants = {
  /* player movement direction */
  MOVE_LEFT: 1,
  MOVE_RIGHT: 2,
  STOP_LEFT: 3,
  STOP_RIGHT: 4,
  STOP: 5,
  STOP_JUMP: 6,
  
  /* Physics constants */
  BASE_WALK_SPEED: 10,
  
  /* keyboard
   * http://help.adobe.com/en_US/AS2LCR/Flash_10.0/help.html?content=00000520.html
   */
  KEY_LEFT: 37,
  KEY_UP: 38,
  KEY_RIGHT: 39,
  KEY_CTRL: 17,
  KEY_e: 69,
  KEY_g: 71,
  KEY_q: 81,
  KEY_t: 84
};

// check if node
if (typeof module !== 'undefined') {
  module.exports = constants;
}
