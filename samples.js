const sampleInput = {
  marsMap: [5, 3],
  robots: [{
    initialPosition: [1, 1, "E"],
    movements: ['R', 'F', 'R', 'F', 'R', 'F', 'R', 'F']
  }, {
    initialPosition: [3, 2, "N"],
    movements: ['F', 'R', 'R', 'F', 'L', 'L', 'F', 'F', 'R', 'R', 'F', 'L', 'L']
  }, {
    initialPosition: [0, 3, "W"],
    movements: ['L', 'L', 'F', 'F', 'F', 'L', 'F', 'L', 'F', 'L']
  },
  ]
}

const sampleOutput =
  `1 1 E
   3 3 N LOST
   2 3 S
  `


module.exports = {
  sampleInput
}
