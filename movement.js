const Robot = require('./robot');
const common = require('./common');
const fs = require('fs');
let scentsHistory;

function retrievePreviousScents({ mapCoordinates }) {
  scentsHistory = JSON.parse(fs.readFileSync('scentsOfDeath.json', 'utf8'));
  return scentsHistory.filter(item => JSON.stringify(item.marsMap) === JSON.stringify(mapCoordinates))
}

function storeNewScents({ mapCoordinates, newScents }) {
  const existingMap = scentsHistory.find(item => JSON.stringify(item.marsMap) === JSON.stringify(mapCoordinates))
  if (existingMap === undefined) {
    scentsHistory.push({
      marsMap: mapCoordinates,
      scentsOfDeath: newScents
    })
  } else {
    // TODO
  }
  fs.writeFile("scentsOfDeath.json", JSON.stringify(scentsHistory), function(err) {
    if (err) {
      console.log(`Error writing json to file: ${err}`);
    }
  });

}

function moveRobots({instructions}) {
  try {
    let deadRobotsScents = retrievePreviousScents({mapCoordinates: instructions.marsMap});
    deadRobotsScents = deadRobotsScents.length > 0 ? deadRobotsScents["0"].scentsOfDeath : [];
    const robotsFinalPositions = [];
    for (const robotObj of instructions.robots) {
      const robot = new Robot({marsMap: instructions.marsMap, robot: robotObj, deadScents: deadRobotsScents})
      const { finalPosition, deadScentInstruction } = robot.move();
      if (deadScentInstruction) {
          deadRobotsScents.push(deadScentInstruction);
      }
      deadRobotsScents = Array.from([...deadRobotsScents.map(JSON.stringify)], JSON.parse);
      robotsFinalPositions.push(finalPosition);
    }
    storeNewScents({ mapCoordinates: instructions.marsMap, newScents: deadRobotsScents});
    return common.buildApiResponse({code: 200, message: "success", body: robotsFinalPositions});
  } catch (e) {
    return common.buildApiResponse({code: 500, message: `Error moving robot: ${e}`});
  }
}

module.exports = {
  moveRobots
}
