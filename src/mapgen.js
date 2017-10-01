/* jshint esversion: 6 */

module.exports = function () {
  let map = [{
    x: 294,
    y: 294,
    height: 21,
    width: 294,
    tile: 123,
    solid: true
  }, {
    x: 294,
    y: 315,
    height: 378,
    width: 294,
    tile: 152
  }, {
    x: 105,
    y: 189,
    height: 21,
    width: 189,
    tile: 123,
    solid: true
  }, {
    x: 105,
    y: 210,
    height: 399,
    width: 189,
    tile: 152
  }];

  for (var i = 0; i < 800; i++) {
    map.push({
      x: 588 + 21 * i,
      y: 294 - 21 * Math.round(16 * i/400 * Math.sin(Math.PI * i/12)),
      height: 21,
      width: 21,
      tile: 123,
      solid: true
    });
  }

  return map;
};
