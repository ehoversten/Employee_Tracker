const mysql = require("mysql");
require("console.table");
const PORT = process.env.PORT;

// Database Configuration
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB
});

// Establish Connection
connection.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected");
});

// Export our connection (variable) to the database
module.exports = connection;
