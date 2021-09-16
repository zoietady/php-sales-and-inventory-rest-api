/* import drivers and connection configuration */
const mysql = require("mysql");
const dbConfig = require("../config/dbconfig.js");

/* create connection instance */
let connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

connection.getConnection(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
});

/* export connection */
module.exports = connection;