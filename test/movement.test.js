/* eslint-disable no-undef */
const assert = require('assert');
const movement = require('../movement');
const samples = require('../samples');
const common = require('../common');

describe('Movement test', () => {
  it('Sample input should return 200', () => {
    assert.equal(
      movement.moveRobots({ instructions: samples.sampleInput }).statusCode,
      200
    );
  });
  it('Moving 360 degrees should return same initial position', () => {
    const initialPosition = [1, 1, 'E'];
    assert.equal(
      JSON.stringify(
        movement.moveRobots({
          instructions: {
            marsMap: [3, 3],
            robots: [
              {
                initialPosition: initialPosition,
                movements: ['R', 'R', 'R', 'R'],
              },
            ],
          },
        }).body['0']
      ),
      JSON.stringify(initialPosition)
    );
  });
});

after(async () => {
  await common.resetMapHistory();
});
