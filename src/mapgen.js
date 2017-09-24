module.exports = function () {
  map = [{
    x: 294,
    y: 294,
    height: 21,
    width: 294,
    tile: 1
  }, {
    x: 294,
    y: 315,
    height: 378,
    width: 294,
    tile: 2
  }, {
    x: 105,
    y: 189,
    height: 21,
    width: 189,
    tile: 1
  }, {
    x: 105,
    y: 210,
    height: 399,
    width: 189,
    tile: 2
  }];

  for (var i = 0; i < 200; i++) {
    map.push({
      x: 588 + 21 * i,
      y: 294 - 21 * Math.round(4*Math.sin(Math.PI*i/12)),
      height: 21,
      width: 21,
      tile: 1
    });
  }

  return map;
};
