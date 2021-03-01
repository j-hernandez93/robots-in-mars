const samples = require('./samples');
const common = require('./common');
let fullInstructions = new Object();
const validCardinalPoints = ['N', 'S', 'E', 'W'];
const validMovements = ['L', 'R', 'F']; // Left, Right, Forward at the moment, open to changes.

function coordinatesToIntList(coords) {
  const coordsList = [];

  for (const item of coords) {
    const intCoordinate = Number(item);
    if (Number.isNaN(intCoordinate)) {
      return common.buildApiResponse({
        code: 400,
        message: common.MSG_COORDINATES_NEED_TO_BE_NUMBERS,
      });
    } else if (intCoordinate < 0) {
      return common.buildApiResponse({
        code: 400,
        message: common.MSG_COORDINATES_NEED_TO_BE_POSITIVE,
      });
    } else if (intCoordinate > 50) {
      return common.buildApiResponse({
        code: 400,
        message: common.MSG_COORDINATES_MAX_SIZE_EXCEEDED,
      });
    }
    coordsList.push(intCoordinate);
  }
  return coordsList;
}

function getMovements(movements) {
  movements.forEach((movement) => {
    if (!validMovements.includes(movement)) {
      return common.buildApiResponse({
        code: 400,
        message: `The movement ${movement} is not included in the system. 
      Please only use one of the following: ${validMovements.join(',')}`,
      });
    }
  });
  return movements;
}

function getInitialPosition(initialPosition) {
  if (initialPosition.length !== 3) {
    return common.buildApiResponse({
      code: 400,
      message: common.MSG_INVALID_ROBOT_INITIAL_POSITION,
    });
  }
  const coordX = Number(initialPosition[0]);
  const coordY = Number(initialPosition[1]);
  const orientation = initialPosition[2];

  switch (true) {
    case Number.isNaN(coordX):
    case Number.isNaN(coordY):
      return common.buildApiResponse({
        code: 400,
        message: common.MSG_COORDINATES_NEED_TO_BE_NUMBERS,
      });
    case coordX < 0:
    case coordY < 0:
      return common.buildApiResponse({
        code: 400,
        message: common.MSG_COORDINATES_NEED_TO_BE_POSITIVE,
      });
    case coordX > fullInstructions.marsMap[0]:
    case coordY > fullInstructions.marsMap[1]:
      return common.buildApiResponse({
        code: 400,
        message: common.MSG_COORDINATES_OUTSIDE_THE_MAP,
      });
    case !validCardinalPoints.includes(initialPosition[2]):
      return common.buildApiResponse({
        code: 400,
        message:
          `The cardinal point specified (${initialPosition[2]}) does not exist` +
          common.MSG_USE_VALID_CARDINAL_POINT,
      });
    default:
      break;
  }
  return [coordX, coordY, orientation];
}

function appendRobot(directions) {
  const robotObj = new Object();
  const initialPos = getInitialPosition(directions[0].split(' '));
  if (initialPos.statusCode === 400) {
    return initialPos;
  }
  robotObj.initialPosition = initialPos;
  const movements = getMovements(directions[1].split(''));
  if (movements.status !== undefined) {
    return initialPos;
  }
  robotObj.movements = movements;
  fullInstructions.robots.push(robotObj);
  return;
}

function buildRobotsInstructions(data) {
  // Let's clean the data first (empty lines and line breaks).
  data = data.filter((item) => item !== '').map((item) => item.trim());
  const dataLength = data.length;

  if (dataLength === 0) {
    return common.buildApiResponse({
      code: 400,
      message: common.MSG_ROBOT_INITIAL_COORDINATES_MISSING,
    });
  } else if (dataLength % 2 !== 0) {
    return common.buildApiResponse({
      code: 400,
      message:
        `${data.length} directions found.` + common.MSG_EVEN_LINES_NEEDED,
    });
  }

  fullInstructions.robots = [];
  for (let i = 0; i < dataLength; i += 2) {
    let appendRes = appendRobot(data.slice(i, i + 2));
    if (appendRes) {
      return appendRes;
    }
  }
  return;
}

function buildMapCoordinates(data) {
  const coordinatesList = data.trim().split(' ');
  if (coordinatesList.length != 2) {
    return common.buildApiResponse({
      code: 400,
      message: common.MSG_INVALID_COORDINATES_DIMENSIONS,
    });
  }
  const coordsParsed = coordinatesToIntList(coordinatesList);
  if (coordsParsed.status !== undefined) {
    return coordsParsed;
  }
  fullInstructions.marsMap = coordsParsed;
  return;
}

function validate({ instructions }) {
  try {
    if (instructions === '') {
      return common.buildApiResponse({
        code: 200,
        message: common.MSG_SUCCESS,
        body: samples.sampleInput,
      });
    }
    instructions = instructions.split('\n');
    const mapCoordsRes = buildMapCoordinates(instructions[0]);
    if (mapCoordsRes) {
      return mapCoordsRes;
    }
    const robotInstructionsRes = buildRobotsInstructions(instructions.slice(1));
    if (robotInstructionsRes) {
      return robotInstructionsRes;
    }
    return common.buildApiResponse({
      code: 200,
      message: common.MSG_SUCCESS,
      body: fullInstructions,
    });
  } catch (e) {
    return common.buildApiResponse({
      code: 500,
      message: `internal server error: ${e}`,
    });
  }
}

module.exports = {
  validate,
};
