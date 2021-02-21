class Robot {
  constructor({marsMap, robot, deadScents}) {
    this.marsMap = marsMap;
    this.robot = robot;
    this.deadScents = deadScents;
  }

  moveRight() {
    switch (this.coordinates[2]) {
      case "N":
        this.coordinates[2] = "E"
        break;
      case "S":
        this.coordinates[2] = "W"
        break;
      case "E":
        this.coordinates[2] = "S"
        break;
      case "W":
        this.coordinates[2] = "N"
        break;
    }
    return this.coordinates;
  }

  moveLeft() {
    switch (this.coordinates[2]) {
      case "N":
        this.coordinates[2] = "W"
        break;
      case "S":
        this.coordinates[2] = "E"
        break;
      case "E":
        this.coordinates[2] = "N"
        break;
      case "W":
        this.coordinates[2] = "S"
        break;
    }
    return this.coordinates;
  }

  moveForward() {
    // FIXME comment!
    if (this.deadScents.filter(array => JSON.stringify(array) === JSON.stringify(this.coordinates)).length > 0) {
      return this.coordinates; // If the new movement implies a known death, let's omit it.
    }
    switch (this.coordinates[2]) {
      case "N":
        if (this.coordinates[1] + 1 > this.marsMap[1]) {
          this.coordinates.push('LOST');
        } else {
          this.coordinates[1] += 1
        }
        break;
      case "S":
        if (this.coordinates[1] - 1 < 0) {
          this.coordinates.push('LOST')
        } else {
          this.coordinates[1] -= 1
        }
        break;
      case "E":
        if (this.coordinates[0] + 1 > this.marsMap[0]) {
          this.coordinates.push('LOST')
        } else {
          this.coordinates[0] += 1
        }
        break;
      case "W":
        if (this.coordinates[0] - 1 < 0) {
          this.coordinates.push('LOST')
        } else {
          this.coordinates[0] -= 1
        }
        break;
    }
    return this.coordinates;
  }

  moveDirection(coordinates, direction) {
    this.coordinates = coordinates;
    switch (direction) {
      case "R":
        return this.moveRight();
      case "L":
        return this.moveLeft();
      case "F":
        return this.moveForward();
      default:
        throw `Unimplemented direction ${direction}`;
    }
  }

  move() {
    let startingPosition = [...this.robot.initialPosition];
    let finalPosition = [...startingPosition];
    for (const movement of this.robot.movements) {
      finalPosition = this.moveDirection([...startingPosition], movement);
      if (finalPosition[3] && finalPosition[3] === 'LOST') {
        // deadScentInstruction is the movement which caused the dead.
        return {finalPosition, deadScentInstruction: startingPosition}
      }
      startingPosition = [...finalPosition];
    }
    return {finalPosition, deadScentInstruction: undefined};
  }

}

module.exports = Robot;
