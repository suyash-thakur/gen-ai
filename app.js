const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser");
const index = require('./routes');
const app = express();
const mongoose = require("mongoose");

app.use(cors());
app.use(express.static(path.join(__dirname, '.')));
app.use(bodyParser.json());

app.use("/", index);

const connection_url = process.env.DB_URL;
mongoose.connect(connection_url, {

}).then(() => {
    console.log("Connected to database!");
}).catch(() => {
    console.log("Connection failed!");
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});


module.exports = app;

