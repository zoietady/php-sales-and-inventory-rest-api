/* import drivers and connection configuration */
const mysql = require("mysql");
// const dbConfig = require("../config/dbconfig.js");

/* create connection instance */
let connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
});

connection.getConnection(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
});

/* export connection */
module.exports = connection;