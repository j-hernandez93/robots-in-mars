const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const validator = require('./validator');
const movement = require('./movement');
const common = require('./common');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/map', (req, res) => {
  const validatorResponse = validator.validate({
    instructions: req.body.instructions,
  });
  if (validatorResponse.statusCode !== 200) {
    res
      .status(validatorResponse.statusCode)
      .send(
        `<p>There was an error with the provided instructions: <br> <i>${validatorResponse.message}</i></p><br><button onclick='window.history.back()'>Try again!</button>`
      );
  }
  const movementResponse = movement.moveRobots({
    instructions: validatorResponse.body,
  });
  if (movementResponse.statusCode !== 200) {
    res.send(
      `<p>There was an error with the robot movement: <br> <i>${movementResponse.message}</i></p><br><button onclick='window.history.back()'>Modify your input!</button>`
    );
  }
  res.send(
    `<p>The resulting robots coordinates are: <br> <textarea>${common.buildRobotsOutput(
      movementResponse.body
    )}</textarea></p><br><button onclick='window.history.back()'>Try again with another input!</button><button onclick='window.location="/getPreviousMaps"'>Visit previous dead robots by map</button>`
  );
});

app.get('/getPreviousMaps', (req, res) => {
  const previousMaps = common.getMapHistory();
  let rows = '';
  for (let i = 0; i < previousMaps.length; i++) {
    rows += `<tr> 
              <th>${previousMaps[i].marsMap}</th>
              <th>${previousMaps[i].scentsOfDeath}</th>
              </tr>`;
  }
  res.send(
    `<p>Previous maps: <br>
     <table>
<tr> 
              <th>Mars Map</th>
              <th>Dead scents</th>
              </tr>
              ${rows} 
</table>
    <button onClick='window.location="/"'> Home </button>
    <form action="/clearHistory" method='post'><button type='submit' formmethod='post'> Clear map History </button></form>
    `
  );
});

app.post('/clearHistory', (req, res) => {
  const resClearHistory = common.resetMapHistory();
  let content = '';
  if (resClearHistory.statusCode !== 200) {
    content += `<p>There was an error when trying to clear the map history: <br> <i>${resClearHistory.message}</i></p><br>`;
  } else {
    content += 'Successfully cleared map history!';
  }
  res.send(
    `${content} <button onClick='window.location="/"'>Go back to main page</button>`
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App running...');
});
