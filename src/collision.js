/* jshint esversion: 6 */

/*
 * Checks for collision on two rectangles.
 *
 * @param {object} rect1 = {x: Number, y: Number, width: Number, height: Number}
 * @param {object} rect2 = {x: Number, y: Number, width: Number, height: Number}
 * @return {boolean}
 */
function isRectCollision(rect1, rect2) {
  return (rect1.x < rect2.x + rect2.width &&
          rect1.x + rect1.width > rect2.x &&
          rect1.y < rect2.y + rect2.height &&
          rect1.height + rect1.y > rect2.y);
}

/*
 * Checks for a collision between two circles
 *
 * @param {object} circle1 = {radius: Number, x: Number, y: Number}
 * @param {object} circle1 = {radius: Number, x: Number, y: Number}
 * @return {boolean}
 */
function isCircularCollision(circle1, circle2) {
  let dx = circle1.x - circle2.x;
  let dy = circle1.y - circle2.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  return (distance < circle1.radius + circle2.radius);
}

/*
 * Checks for collision between a rectangle and a circle
 *
 * @param {object} circle = {radius: Number, x: Number, y: Number}
 * @param {object} rect = {x: Number, y: Number, width: Number, height: Number}
 * @return {object}
 */
function isCircleRectangleCollision(circle, rect){
  let distX = Math.abs(circle.x - rect.x-rect.width/2);
  let distY = Math.abs(circle.y - rect.y-rect.height/2);

  if (distX > (rect.width/2 + circle.radius)) { return false; }
  if (distY > (rect.height/2 + circle.radius)) { return false; }

  if (distX <= (rect.width/2)) { return true; }
  if (distY <= (rect.height/2)) { return true; }

  let dx=distX-rect.width/2;
  let dy=distY-rect.height/2;
  return (dx*dx+dy*dy<=(circle.radius*circle.radius));
}

module.exports = {
  isRectCollision: isRectCollision,
  isCircularCollision: isCircularCollision,
  isCircleRectangleCollision: isCircleRectangleCollision
};
