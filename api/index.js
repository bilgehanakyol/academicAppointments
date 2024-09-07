const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from API!');
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
