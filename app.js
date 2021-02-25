// TODO eslint
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const validator = require('./validator');
const movement = require('./movement');
const common = require('./common');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/map', (req, res) => {
  const validatorResponse = validator.validate({instructions: req.body.instructions});
  if (validatorResponse.statusCode !== 200) {
    res.status(validatorResponse.statusCode).send(
      `<p>There was an error with the provided instructions: <br> <i>${validatorResponse.message}</i></p><br><button onclick="window.history.back()">Try again!</button>`) //validatorResponse.message);
  }
  const movementResponse = movement.moveRobots({instructions: validatorResponse.body});
  if (movementResponse.statusCode !== 200) {
    res.send(
      `<p>There was an error with the robot movement: <br> <i>${movementResponse.message}</i></p><br><button onclick="window.history.back()">Try again with another input!</button>`);
  }
  res.send(
    `<p>The resulting robots coordinates are: <br> <textarea>${common.buildRobotsOutput(movementResponse.body)}</textarea></p><br><button onclick="window.history.back()">Try again with another input!</button><button onclick="window.history.back()">Visit previous dead robots by map</button>`);

})

app.get('/getPreviousMaps', (req, res) => {
  // TODO
  res.send('Delete me when implemented!')
})

app.listen(process.env.PORT || 3000, () => {
  console.log("App running...")
});
