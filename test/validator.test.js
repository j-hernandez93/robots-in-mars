/* eslint-disable no-undef */
const assert = require('assert');
const validator = require('../validator');
const samples = require('../samples');
const common = require('../common');

describe('Validate test', () => {
  it('No input test should return sample test', () => {
    assert.equal(
      validator.validate({ instructions: '' }).body,
      samples.sampleInput
    );
  });
  it('3 dimension map coordinates should return error', () => {
    assert.equal(
      validator.validate({ instructions: '10 10 10' }).message,
      common.MSG_INVALID_COORDINATES_DIMENSIONS
    );
  });
  it('no robot coordinates should return error', () => {
    assert.equal(
      validator.validate({ instructions: '10 10' }).message,
      common.MSG_ROBOT_INITIAL_COORDINATES_MISSING
    );
  });
  it('odd lines (robot, movements) should return error', () => {
    assert.equal(
      validator
        .validate({ instructions: '10 10 \n 1 1 E' })
        .message.includes(common.MSG_EVEN_LINES_NEEDED),
      true
    );
  });
  it('unexpected cardinal point should return error', () => {
    assert.equal(
      validator
        .validate({ instructions: '10 10 \n 1 1 Q \n F' })
        .message.includes(common.MSG_USE_VALID_CARDINAL_POINT),
      true
    );
  });
  it('robot initial position outside the map should return error', () => {
    assert.equal(
      validator.validate({ instructions: '10 10 \n 12 1 N \n F' }).message,
      common.MSG_COORDINATES_OUTSIDE_THE_MAP
    );
  });
  it('robot initial position negative numbers should return error', () => {
    assert.equal(
      validator.validate({ instructions: '10 10 \n -1 1 N \n F' }).message,
      common.MSG_COORDINATES_NEED_TO_BE_POSITIVE
    );
  });
  it('map coordinates not numbers should return error', () => {
    assert.equal(
      validator.validate({ instructions: 'x 10 \n x y N \n F' }).message,
      common.MSG_COORDINATES_NEED_TO_BE_NUMBERS
    );
  });
  it('invalid initial robot coordinates should return error', () => {
    assert.equal(
      validator.validate({ instructions: '10 10 \n 10 10 \n F' }).message,
      common.MSG_INVALID_ROBOT_INITIAL_POSITION
    );
  });
});
