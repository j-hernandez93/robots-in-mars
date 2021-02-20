// Object example.
// let fullInstructions = {
//   mapCoordinates: [2, 3],
//   robots: [{
//     initialPosition: [1, 3, "E"],
//     movements: ["E", "L", "L"]
//   },
//     {
//       initialPosition: [1, 1, "E"],
//       movements: ["E", "L", "L", "L", "L"]
//     }]
// }

let fullInstructions = new Object();


function firstLineContainsCoordinates(initialCoordinates) {

}

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

function buildMapCoordinates(data) {
  const coordinatesList = data.split(" ");
  if (coordinatesList.length != 2) {
    throwValidatorMessage("Coordinates should only be 2 dimensions!")
  }
  fullInstructions.mapCoordinates = coordinatesToIntList(coordinatesList);
}

function validate({instructions}) {
  try {
    buildMapCoordinates(instructions.split('\n')[0]);
    console.log(fullInstructions)
    return "success" // TODO replace this with other message.
  } catch (e) {
    // TODO.
  }
}

module.exports = {
  validate
}
