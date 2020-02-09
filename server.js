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

    inquirer
      .prompt([
          /* Pass your questions in here */
          {
              type: 'list',
              name: 'viewSelect',
              message: "What would you like to do?",
              choices: [
                  "View Departments",
                  "Add Department",
                  "View Roles", 
                  "Add Role", 
                  "View Employees", 
                  "Exit"
                ]
          }
      ])
      .then(answers => {
        // TEST that we are getting back what we expect from the USER
        // console.log(answers);
        // console.log(answers.viewSelect);

        // Pass user selection object
        processChoice(answers);
      });
}

function processChoice(choice) {
    // Using ES6 syntax we DECONSTRUCT the variable from the object passed in
    let { viewSelect } = choice;

    // Let our SWITCH statement direct our program flow
    switch (viewSelect) {
      case "View Departments":
        findDepartments();
        break;
      case "Add Department":
        addDepartments();
        break;
      case "View Roles":
        findRoles();
        break;
      case "Add Role":
        addRoles();
        break;
      case "View Employees":
        findEmployees();
        break;
      case "Exit":
        console.log("Goodbye...");
        endConnection();
        break;
      default:
        console.log("Please make a selection");
        start();
    }
}

// ---------------------------------------- //
//          Find All Departments
// ---------------------------------------- //
function findDepartments() {
    console.log("in departments");
    // Query our database for all departments
    connection.query("SELECT * FROM departments", (err, data) => {
      if (err) throw err;

    //   console.log(data);
      data.map(result => {
          console.log(`${result.id} | ${result.name}`)
          console.log("-----------------------------------")
      });
      // return data;
      start();
    });
}

// ---------------------------------------- //
//          Add A Department
// ---------------------------------------- //
function addDepartments() {
    // Create another Inquirer Promise to query user for new Department Name
    inquirer
        .prompt(
            [{
                type: 'input',
                message: "Name of the Department to add?",
                name: "addDept"
            }]
        ).then(res => {
            let { addDept } = res;
            // Add New Department to our database
            connection.query("INSERT INTO departments SET ?", { name: addDept }, function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " department inserted!\n");
              findDepartments();
            });
        });
}

// ---------------------------------------- //
//          Find All Roles
// ---------------------------------------- //
function findRoles() {
    console.log("in departments");
    // Query our database for all roles
    connection.query("SELECT * FROM roles", (err, data) => {
      if (err) throw err;

    //   console.log(data);
      data.map(result => {
          console.log(`${result.id} | ${result.title} - ${result.salary}`)
          console.log("-----------------------------------")
      });
      // return data;
      start();
    });
}

// ---------------------------------------- //
//              Add A Role
// ---------------------------------------- //
function addRoles() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: "Title of role to add?",
                name: 'roleTitle'
            },
            {
                type: 'input',
                message: "Salary of role?",
                name: 'roleSalary'
            },
            {
                type: 'input',
                message: "Department Identification Number?",
                name: 'roleDeptId'
            },
    ]).then(res => {
        // Create a new role OBJ from user inputs to pass to our mysql query
        let newRole = { 
            title: res.roleTitle, 
            salary: parseFloat(res.roleSalary), 
            department_id: parseInt(res.roleDeptId) 
        }
        // console.log(newRole)

        connection.query(
          "INSERT INTO roles SET ?", newRole, (err, res) => {
            if (err) throw err;
            console.log(res.affectedRows + " role inserted!\n");
            findRoles();
          }
        );
    })
}


// ---------------------------------------- //
//          Find All Employees
// ---------------------------------------- //
function findEmployees() {
    // Query our database for all employees
    connection.query("SELECT * FROM employees", (err, data) => {
      if (err) throw err;

    //   console.log(data);
      data.map(result => {
          console.log(`${result.id} | ${result.first_name} ${result.last_name}`)
          console.log("-----------------------------------")
      });
      // return data;
      start();
    });
}

// ---------------------------------------- //
//    Exit Program End Database Connection
// ---------------------------------------- //
function endConnection() {
    console.log("Disconnecting Database");
    connection.end();
}

