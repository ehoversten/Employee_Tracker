const mysql = require("mysql");
const inquirer = require("inquirer");
const PORT = 3306;

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: PORT,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employee_tracker"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log(`Database Connected on ${PORT}`)
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
    console.log("Database Started and Connected Time to code!")
}
