const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

app.get('/ping', (req, res) => res.send('pong !!'));


module.exports = app;
