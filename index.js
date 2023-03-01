const express = require('express')
const cors = require("cors");
const sql = require("./app/models/db");
var corsOptions = {
    origin: "http://localhost:8081"
};
const app = express()

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
