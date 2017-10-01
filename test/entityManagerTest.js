/* jshint esversion: 6 */
/* jshint expr: true */

const assert = require('chai').assert;
const em = require('../src/entityManager');

describe('entityManager', function() {
  it('getFreeId should return Number', function() {
    assert.isNumber(em.getFreeId());
  });
});
