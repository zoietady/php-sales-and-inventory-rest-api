/* import drivers and connection configuration */
const mysql = require("mysql");
// const dbConfig = require("../config/dbconfig.js");

/* create connection instance */
let connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  multipleStatements: true
});

connection.getConnection(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
});

connection.query("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));")

/* export connection */
module.exports = connection;