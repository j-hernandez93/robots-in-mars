const samples = require('./samples');
const common = require('./common');
let fullInstructions = new Object();
const validCardinalPoints = ['N', 'S', 'E', 'W'];
const validMovements = ['L', 'R', 'F']; // Left, Right, Forward at the moment, open to changes.

function coordinatesToIntList(coords) {
  const coordsList = [];
  try {
    for (const item of coords) {
      coordsList.push(Number(item));
    }
    return coordsList;
  } catch (e) {
    return common.buildApiResponse({code: 400, message: "Please, add coordinates as numbers. Example: 10 10"});
  }
}

function getMovements(movements) {
  movements.forEach(movement => {
    if (!validMovements.includes(movement)) {
      return common.buildApiResponse({
        code: 400, message: `The movement ${movement} is not included in the system. 
      Please only use one of the following: ${validMovements.join(',')}`
      });
    }
  })
  return movements;
}

function getInitialPosition(initialPosition) {
  if (initialPosition.length !== 3) {
    return common.buildApiResponse({
      code: 400, message: "There should be 3 variables for determining the initial position of the robot. " +
        "x, y and a cardinal point (N, S, E, W). Example: 10 10 E"
    });
  }
  const coordX = Number(initialPosition[0]);
  const coordY = Number(initialPosition[1]);
  const orientation = initialPosition[2];
  switch (initialPosition) {
    case Number.isNaN(coordX), Number.isNaN(coordY):
      return common.buildApiResponse({
        code: 400, message: "Initial coordinates have to be numbers."
      })
      break;
    case coordX < 0, coordY < 0:
      return common.buildApiResponse({
        code: 400, message: "Initial coordinates have to be positive."
      })
      break;
    case coordX > fullInstructions.marsMap[0], coordY > fullInstructions.marsMap[1]:
      return common.buildApiResponse({
        code: 400, message: "Initial coordinates cannot be outside the map!"
      });
      break;
    case validCardinalPoints.includes(initialPosition[2]):
      return common.buildApiResponse({
        code: 400, message: `The cardinal point specified (${initialPosition[2]}) does not exist. 
      Please select one within the following: (N, S, E, W)`
      });
      break;
    default:
      break
  }
  return [coordX, coordY, orientation];
}

function appendRobot(directions) {
  const robotObj = new Object();
  const initialPos = getInitialPosition(directions[0].split(" "));
  if (initialPos.status !== undefined) {
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
  data = data.filter(item => item !== "").map(item => item.trim())
  const dataLength = data.length;

  if (dataLength === 0) {
    return common.buildApiResponse({code: 400, message: "Please, add any robot initial coordinates and directions."})
  } else if (dataLength % 2 !== 0) {
    return common.buildApiResponse({
      code: 400, message: `${data.length} directions found. Please, add even lines (1 line for the robot's initial 
    coordinates and the following with the directions.`
    })
  }

  fullInstructions.robots = [];
  for (let i = 0; i < dataLength; i += 2) {
    let appendRes = appendRobot(data.slice(i, i + 2));
    if (appendRes !== undefined) {
      return appendRes;
    }
  }
  return;
}

function buildMapCoordinates(data) {
  const coordinatesList = data.trim().split(" ");
  if (coordinatesList.length != 2) {
    return common.buildApiResponse({code: 400, message: "Coordinates should only be 2 dimensions!"})
  }
  const coordsParsed = coordinatesToIntList(coordinatesList);
  if (coordsParsed.status !== undefined) {
    return coordsParsed;
  }
  fullInstructions.marsMap = coordsParsed;
  return;
}

function validate({instructions}) {
  try {
    if (instructions === '') {
      return common.buildApiResponse({code: 200, message: "success", body: samples.sampleInput});
      ;
    }
    instructions = instructions.split('\n');
    const mapCoordsRes = buildMapCoordinates(instructions[0]);
    if (mapCoordsRes) {
      return mapCoordsRes;
    }
    // TODO coordinates positive validation.
    // TODO coordinates x and y max values are 50
    const robotInstructionsRes = buildRobotsInstructions(instructions.slice(1));
    if (robotInstructionsRes) {
      return robotInstructionsRes;
    }
    return common.buildApiResponse({code: 200, message: "success", body: fullInstructions});
  } catch (e) {
    return common.buildApiResponse({code: 500, message: `internal server error: ${e}`})
  }
}

module.exports = {
  validate
}
