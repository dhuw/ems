const mysql = require("mysql2");
require('dotenv').config();

//database connection
const db = mysql.createConnection(
    {
    host: "localhost",
    //mysql username and password
    user: process.env.DB_USER,
    password: process.env.DB_USER,
    database: process.env.DB_USER
    },
    console.log("you're connected to the database")
);

module.exports = db;
