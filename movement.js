const samples = require('./samples'); // fixme delete
const Robot = require('./robot');
const fs = require('fs');
let scentsHistory;

moveRobots(samples.sampleInput) // fixme delete

function retrievePreviousScents({ mapCoordinates }) {
  scentsHistory = JSON.parse(fs.readFileSync('scentsOfDeath.json', 'utf8'));
  return scentsHistory.filter(item => JSON.stringify(item.marsMap) === JSON.stringify(mapCoordinates))
}

function storeNewScents({ mapCoordinates, newScents }) {
  // TODO update table/file with dead robots scents.
  const existingMap = scentsHistory.find(item => JSON.stringify(item.marsMap) === JSON.stringify(mapCoordinates))
  if (existingMap === undefined) {
    scentsHistory.push({
      marsMap: mapCoordinates,
      scentsOfDeath: newScents
    })
  }
  fs.writeFile("scentsOfDeath.json", JSON.stringify(scentsHistory), function(err) {
    if (err) {
      console.log(`Error writing json to file: ${err}`);
    }
  });
}

function moveRobots(instructions) {
  try {
    let deadRobotsScents = retrievePreviousScents({mapCoordinates: instructions.marsMap});
    deadRobotsScents = deadRobotsScents.length > 0 ? deadRobotsScents.scentsOfDeath : [];
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
    return robotsFinalPositions;
  } catch (e) {
    // throwValidatorMessage(`500 internal server error.`) // TODO common error.
    // TODO.
  }
}

module.exports = {
  moveRobots
}
