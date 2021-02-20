// TODO eslint
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const validator = require('./validator');
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
  // res.send('Hello World!') // TODO delete me
})

app.post('/', (req, res) => {
  res.send(validator.validate({ instructions: req.body.instructions }));
})

app.post('/saveMap', (req, res) => {
  // Validate Insert params into file
  // 1. File position 0 = starting point // TODO implement with Filesystem input.
  // Check the file is correct! // TODO
  // 2. Fallback url // TODO
  res.send(Validator(req.body));
})

app.get('/finalMap', (req, res) => {
  // Make movements from txt
  res.send('Delete me when implemented!')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
