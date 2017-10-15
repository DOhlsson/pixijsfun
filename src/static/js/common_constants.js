/*jshint esversion: 6 */

/* player movement */
const MOVE_LEFT = 1;
const MOVE_RIGHT = 2;
const STOP_LEFT = 3;
const STOP_RIGHT = 4;
const STOP = 5;
const STOP_JUMP = 6;

/* keyboard
 * http://help.adobe.com/en_US/AS2LCR/Flash_10.0/help.html?content=00000520.html
 */
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_CTRL = 17;
const KEY_e = 69;
const KEY_g = 71;
const KEY_q = 81;
const KEY_t = 84;

// check if node
if (typeof module !== 'undefined') {
  module.exports = {
    MOVE_LEFT: MOVE_LEFT,
    MOVE_RIGHT: MOVE_RIGHT,
    STOP_LEFT: STOP_LEFT,
    STOP_RIGHT: STOP_RIGHT,
    STOP: STOP,
    STOP_JUMP: STOP_JUMP,
  
    KEY_LEFT: KEY_LEFT,
    KEY_RIGHT: KEY_RIGHT,
    KEY_UP: KEY_UP,
    KEY_CTRL: KEY_CTRL
  };
}
