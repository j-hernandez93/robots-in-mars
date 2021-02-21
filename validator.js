let fullInstructions = new Object();
const validCardinalPoints = ['N', 'S', 'E', 'W'];
const validMovements = ['L', 'R', 'F']; // Left, Right, Forward at the moment, open to changes.

function throwValidatorMessage(message) {
  // TODO complete! this throw
  return message
}

function coordinatesToIntList(coords) {
  const coordsList = [];
  try {
    for (const item of coords) {
      coordsList.push(Number(item));

    }
    return coordsList;
  } catch (e) {
    throwValidatorMessage("Please, add coordinates as numbers. Example: 10 10");
  }
}

function getMovements(movements) {
  movements.forEach(movement => {
    if (!validMovements.includes(movement)) {
      throwValidatorMessage(`The movement ${movement} is not included in the system. Please only use one of
      the following: ${validMovements.join(',')}`);
    }
  })
  return movements;
}

function getInitialPosition(initialPosition) {
  if (initialPosition.length !== 3) {
    throwValidatorMessage("There should be 3 variables for determining the initial position of the robot. " +
      "x, y and a cardinal point (N, S, E, W). Example: 10 10 E");
  }
  switch (initialPosition) {
    case initialPosition[0] < 0, initialPosition[1] < 0:
      throwValidatorMessage("Initial coordinates have to be positive.")
      break;
    case initialPosition[0] > fullInstructions.marsMap[0], initialPosition[1] > fullInstructions.marsMap[1]:
      throwValidatorMessage("Initial coordinates cannot be outside the map!");
      break;
    case validCardinalPoints.includes(initialPosition[2]):
      throwValidatorMessage(`The cardinal point specified (${initialPosition[2]}) does not exist. 
      Please select one within the following: (N, S, E, W)`);
      break;
    default:
      break
  }
  return initialPosition;
}

function appendRobot(directions) {
  const robotObj = new Object();
  robotObj.initialPosition = getInitialPosition(directions[0].split(" "));
  robotObj.movements = getMovements(directions[0].split(''));
  fullInstructions.robots.push(robotObj);
}

function buildRobotsInstructions(data) {
  // Let's clean the data first (empty lines and line breaks).
  data = data.filter(item => item !== "").map(item => item.trim())
  const dataLength = data.length;

  if (dataLength === 0) {
    throwValidatorMessage("Please, add any robot initial coordinates and directions.")
  } else if (dataLength % 2 !== 0) {
    throwValidatorMessage(`${data.length} directions found. Please, add even lines (1 line for the robot's initial 
    coordinates and the following with the directions.`)
  }

  fullInstructions.robots = [];
  for (let i = 0; i < dataLength; i += 2) {
    appendRobot(data.slice(i, i + 2))
  }
}

function buildMapCoordinates(data) {
  const coordinatesList = data.trim().split(" ");
  if (coordinatesList.length != 2) {
    throwValidatorMessage("Coordinates should only be 2 dimensions!")
  }
  fullInstructions.marsMap = coordinatesToIntList(coordinatesList);
}

function validate({instructions}) {
  try {
    if (instructions === '') {
      return "success" // using default sample input // TODO check!
    }
    instructions = instructions.split('\n');
    buildMapCoordinates(instructions[0]);
    // TODO coordinates positive validation.
    // TODO coordinates x and y max values are 50
    buildRobotsInstructions(instructions.slice(1));
    console.log(fullInstructions);
    return "success" // TODO replace this with other message.
    // TODO for the rest of request errors -> code: 400, reason: bad content, message: message
  } catch (e) {
    throwValidatorMessage(`500 internal server error.`)
    // TODO.
  }
}

module.exports = {
  validate
}
