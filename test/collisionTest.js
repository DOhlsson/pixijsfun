/* jshint esversion: 6 */
/* jshint expr: true */

const assert = require('chai').assert;
const collision = require('../src/collision');

describe('collision', function() {
  it('isRectCollision should return true', function() {
    let rect1 = {
      x: 0,
      y: 0,
      width: 10,
      height: 10
    };

    let rect2 = {
      x: 5,
      y: 5,
      width: 10,
      height: 10
    };

    assert.equal(collision.isRectCollision(rect1, rect2), true);
  }),

  it('isRectCollision should return false', function() {
    let rect1 = {
      x: 0,
      y: 0,
      width: 1,
      height: 1
    };

    let rect2 = {
      x: 2,
      y: 2,
      width: 1,
      height: 1
    };

    assert.equal(collision.isRectCollision(rect1, rect2), false);
  }),

  it('isCircularCollision should return true', function() {
    let circle1 = {
      radius: 5,
      x: 5,
      y: 5
    };

    let circle2 = {
      radius: 5,
      x: 7,
      y: 7
    };

    assert.equal(collision.isCircularCollision(circle1, circle2), true);
  }),

  it('isCircularCollision should return false', function() {
    let circle1 = {
      radius: 5,
      x: 5,
      y: 5
    };

    let circle2 = {
      radius: 5,
      x: 10,
      y: 15
    };

    assert.equal(collision.isCircularCollision(circle1, circle2), false);
  }),

  it('isCircleRectangleCollision should return true', function() {
    let circle1 = {
      radius: 5,
      x: 5,
      y: 5
    };

    let rect1 = {
      x: 8,
      y: 8,
      width: 10,
      height: 10
    };

    assert.equal(collision.isCircleRectangleCollision(circle1, rect1), true);
  }),


  it('isCircleRectangleCollision should return false', function() {
    let circle1 = {
      radius: 5,
      x: 5,
      y: 5
    };

    let rect1 = {
      x: 8,
      y: 10,
      width: 10,
      height: 10
    };

    assert.equal(collision.isCircleRectangleCollision(circle1, rect1), false);
  });
});
