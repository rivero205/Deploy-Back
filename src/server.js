const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

module.exports = app;