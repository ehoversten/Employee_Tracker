const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const logo = require("asciiart-logo");


// Configure Ascii-Art package
let directions = 'Employee Tracker is a Node based Command Line Interface(CLI) backed by a mysql database. Follow the prompts to View all Departments, Roles and Employees. You can add or remove departments, roles and employees as well as update employees roles.'

console.log(logo({ 
  name: "Employee Tracker",
  logoColor: "bold-green",
  textColor: "goldenrod"
  })
  .right('Version 1.0.0')
  .emptyLine()
  .center(directions)
  .render()
);

// Create connection information for the sql database
var connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // console.log(`Database Connected on ${PORT}`)
  // run the start function after the connection is made to prompt the user
  start();
});


function start() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'viewSelect',
        message: "What would you like to do?",
        choices: [
            "View Departments",
            "Add Department",
            "Remove Department",
            "View Roles", 
            "Add Role", 
            "Remove Role",
            "View Employees", 
            "Add Employee",
            "Update Employee Role",
            "Remove Employee",
            "Exit"
        ]
      }
    ]).then(result => {
      // Pass user selection object
      processChoice(result);
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
    case "Remove Department":
      deleteDept();
      break;
    case "View Roles":
      findRoles();
      break;
    case "Add Role":
      addRoles();
      break;
    case 'Remove Role':
      removeRole();
      break;
    case "View Employees":
      findEmployees();
      break;
    case "Add Employee":
      addEmployees();
      break;
    case "Update Employee Role":
      updateRole();
      break;
    case "Remove Employee":
      removeEmployee();
      break;
    case "Exit":
      console.log("\nGoodbye...\n");
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
  // Query our database for all departments
  connection.query("SELECT departments.id, name AS Departments FROM departments", (err, data) => {
    if (err) throw err;

    console.log("-------------------------\n");
    // Using the console.table node package we can display our database query to the user
    console.table(data);
    console.log("-------------------------\n");

    // Back to Main Prompt
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
          // We added new data, let's call the display function
          findDepartments();
        });
      });
}

// ---------------------------------------- //
//          Remove A Department
// ---------------------------------------- //
async function deleteDept() {
  // Create a variable to hold our data

  await connection.query("SELECT * FROM departments", function(err, data) {
      if(err) throw err;
      console.table(data);
    });


  // Prompt for which record to remove
  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'del_id',
        message: "Enter the Identification Number of the department to remove"
      }
    ]).then(res => {
      // create an object to pass to the query
      let rmvDept = {
        id: parseInt(res.del_id)
      };
    
      // Send query to database
      connection.query("DELETE FROM departments WHERE ?", rmvDept, (err, res) => {
        if(err) throw err;
        console.log(res.affectedRows + " department removed!");
        findDepartments();
      });
    })
    .catch(err => {
      if(err) throw err;
    });
}

// ---------------------------------------- //
//            Find All Roles
// ---------------------------------------- //
function findRoles() {
    // Query our database for all roles

    // *** This is a simple query with some ALIASES to better describe the data being displayed in the table
    // connection.query(
    //   "SELECT roles.id, title AS Title, departments.name AS Department, salary AS Compensation FROM roles",

    // *** This is a more complex query that joins the department information as well. Copy this code over to mySql Workbench and break it down and if you need to look further in to INNER JOINS, LEFT/RIGHT JOINS
    connection.query(
      "SELECT roles.id, title AS Title, departments.name AS Department, salary AS Compensation FROM roles JOIN departments ON roles.department_id = departments.id ORDER BY departments.name, roles.salary DESC",
      (err, data) => {
        if (err) throw err;

        console.log("-------------------------\n");
        // Using the console.table node package we can display our database query to the user
        console.table(data);
        console.log("-------------------------\n");

        // Go back to prompt list
        start();
      }
    );
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

      connection.query(
        // Here we use the mysql helper functionality and pass in an OBJECT as the DATA argument to the function
        "INSERT INTO roles SET ?", newRole, (err, res) => {
          // If there is an error, alert
          if (err) throw err;
          // On success
          console.log(res.affectedRows + " role inserted!\n");
          // Let's Display that new data
          findRoles();
        }
      );
  })
}

// ---------------------------------------- //
//             Remove A Role
// ---------------------------------------- //
function removeRole() {
  console.log("Removing Role");

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'rmvRole',
        message: "What Role would you like to remove?"
      }
    ]).then(result => {
      console.log(result);
      let { rmvRole } = result;
      connection.query("DELETE FROM roles WHERE ?", { id: parseInt(rmvRole) }, (err, res) => {
        if(err) throw err;
        console.log(res.affectedRows + " role removed!\n");
        start();
      });
    })
    .catch(err => { if(err) throw err;});
}


// ---------------------------------------- //
//           Find All Employees
// ---------------------------------------- //
function findEmployees() {
    // Query our database for all employees

    // *** This is a simple query with some ALIASES to better describe the data being displayed in the table
    // connection.query("SELECT employees.id, first_name AS First, last_name AS Last, role_id AS Position FROM employees", (err, data) => {


    // *** This is a more complex query that joins the department information as well. Copy this code over to mySql Workbench and break it down and if you need to look further in to INNER JOINS, LEFT/RIGHT JOINS
    connection.query(
      "SELECT employees.id, employees.first_name AS First, employees.last_name AS Last, roles.title AS Title, departments.name AS Department, CONCAT(manager.first_name, ' ', manager.last_name) AS 'Direct Manager', roles.salary AS Salary FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id JOIN employees manager ON manager.id = employees.manager_id;",
      (err, data) => {
        if (err) throw err;

        console.log("-------------------------\n");
        // Using the console.table node package we can display our database query to the user
        console.table(data);
        console.log("-------------------------\n");
        // Go back to main prompt
        start();
      }
    );
}

// ---------------------------------------- //
//           Add An Employee
// ---------------------------------------- //
function addEmployees() {
  inquirer
    .prompt([
      {
          type: 'input',
          message: "Enter first name of new employee",
          name: 'first_name'
      },
      {
          type: 'input',
          message: "Enter last name of employee",
          name: 'last_name'
      },
      {
          type: 'input',
          message: "Enter Role Identification Number",
          name: 'roleId'
      },
      {
          type: 'input',
          message: "Enter Manager Identification Number",
          name: 'managerId'
      },
    ]).then(res => {
      // Create a new role OBJ from user inputs to pass to our mysql query
      let newEmployee = {
        first_name: res.first_name,
        last_name: res.last_name,
        role_id: parseInt(res.roleId),
        manager_id: parseInt(res.managerId)
      };

      // Here we use the mysql helper functionality and pass in an OBJECT as the DATA argument to the function
      connection.query(
        "INSERT INTO employees SET ?", newEmployee, (err, res) => {
          // IF error, log it
          if (err) throw err;
          // If successful, let them know
          console.log(res.affectedRows + " employee inserted!\n");
          // Display updated data
          findEmployees();
        }
      );
    });
}

// ---------------------------------------- //
//         Update Employee Role
// ---------------------------------------- //
function updateRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'empId',
        message: 'Employee Identification Number to change?'
      },
      {
        type: 'input',
        name: 'roleId',
        message: 'Now Role Identification Number?'
      }
    ]).then(result => {
      // Deconstruct the prompt result object
      let { empId, roleId } = result;

      connection.query("UPDATE employees SET ? WHERE ?", [{ role_id: parseInt(roleId) }, { id: parseInt(empId) }], (err, data) => {
        if(err) throw err;

        // console.log(data);
        console.log(data.affectedRows + " products updated!\n");
        start();
      })
    }).catch(err => { if(err) throw err; });
}

// ---------------------------------------- //
//           Remove an Employee
// ---------------------------------------- //
function removeEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'rmvEmployee',
        message: "What is the Employee Identification Number to remove?"
      }
    ]).then(result => {
      console.log(result);
      let { rmvEmployee } = result;
      connection.query("DELETE FROM employees WHERE ?", { id: parseInt(rmvEmployee) }, (err, res) => {
        if (err) throw err;
        console.log(res.affectedRows + " employee removed!\n");
        start();
      });
    })
    .catch(err => { if (err) throw err; });
}

// ---------------------------------------- //
//    Exit Program End Database Connection
// ---------------------------------------- //
function endConnection() {
    // console.log("Disconnecting Database");
    connection.end();
    process.exit();
}
