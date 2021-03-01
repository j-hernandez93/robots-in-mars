const fs = require('fs');

const MSG_INVALID_COORDINATES_DIMENSIONS =
  'Coordinates should only be 2 dimensions!';
const MSG_SUCCESS = 'success';
const MSG_EVEN_LINES_NEEDED =
  "Please, add even lines (1 line for the robot's initial coordinates and the following with the directions.";
const MSG_ROBOT_INITIAL_COORDINATES_MISSING =
  'Please, add any robot initial coordinates and directions.';
const MSG_USE_VALID_CARDINAL_POINT =
  'Please select one within the following: (N, S, E, W)';
const MSG_COORDINATES_OUTSIDE_THE_MAP =
  'Initial coordinates cannot be outside the map!';
const MSG_COORDINATES_NEED_TO_BE_POSITIVE =
  'Initial coordinates need to be positive.';
const MSG_COORDINATES_MAX_SIZE_EXCEEDED =
  'Initial coordinates should be 50 at maximum';
const MSG_COORDINATES_NEED_TO_BE_NUMBERS =
  'Initial coordinates have to be numbers.';
const MSG_INVALID_ROBOT_INITIAL_POSITION =
  'There should be 3 variables for determining the initial position of the robot. x, y and a cardinal point (N, S, E, W). Example: 10 10 E';

function buildApiResponse({ code, message, body = undefined }) {
  return { statusCode: code, message, body };
}

function buildRobotsOutput(results) {
  let strResult = '';
  for (const item of results) {
    strResult += item.join(' ') + '\n';
  }
  return strResult;
}

function getMapHistory() {
  return JSON.parse(fs.readFileSync('scentsOfDeath.json', 'utf8'));
}

function resetMapHistory() {
  fs.writeFile(
    'scentsOfDeath.json',
    JSON.stringify([
      {
        marsMap: [0, 0],
        scentsOfDeath: [
          [0, 0, 'N'],
          [0, 0, 'S'],
          [0, 0, 'E'],
          [0, 0, 'W'],
        ],
      },
    ]),
    function (err) {
      if (err) {
        console.log(`Error writing json to file: ${err}`);
        return buildApiResponse({
          code: 500,
          message: 'Internal server error.',
        });
      }
    }
  );
  return buildApiResponse({
    code: 200,
    message: 'Correctly restored map history!',
  });
}

module.exports = {
  buildApiResponse,
  buildRobotsOutput,
  getMapHistory,
  resetMapHistory,
  MSG_INVALID_COORDINATES_DIMENSIONS,
  MSG_SUCCESS,
  MSG_EVEN_LINES_NEEDED,
  MSG_ROBOT_INITIAL_COORDINATES_MISSING,
  MSG_USE_VALID_CARDINAL_POINT,
  MSG_COORDINATES_OUTSIDE_THE_MAP,
  MSG_COORDINATES_NEED_TO_BE_POSITIVE,
  MSG_COORDINATES_NEED_TO_BE_NUMBERS,
  MSG_INVALID_ROBOT_INITIAL_POSITION,
  MSG_COORDINATES_MAX_SIZE_EXCEEDED,
};
