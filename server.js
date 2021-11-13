// Get the client
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Creates the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: 'lapeach',
  database: 'employeetracker_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  prompts();
});

function prompts() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add an department', 'Add a role', 'Add an employee', 'EXIT'],
    })
    .then(function (answer) {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add an department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'EXIT':
          exit();
          break;
        default:
          break;
      }
    });
}

// view all departments in the database
function viewDepartments() {
  var query = 'SELECT * FROM department';
  connection
    .promise()
    .query(query)
    .then(([rows, fields]) => {
      console.log('**************************************');
      console.log(rows.length + ' Departments found!');
      console.table('All Departments:', rows);
      console.log('**************************************');
      prompts();
    })
    .catch(console.log);
}

// view all roles in the database
function viewRoles() {
  var query = 'SELECT * FROM role';
  connection
    .promise()
    .query(query)
    .then(([rows, fields]) => {
      console.log('**************************************');
      console.log(rows.length + ' Roles found!');
      console.table('All Roles:', rows);
      console.log('**************************************');
      prompts();
    })
    .catch(console.log);
  // .then(() => exit());
}

// view all employees in the database
function viewEmployees() {
  var query = 'SELECT * from employee';
  var query2 = 'SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC';
  connection
    .promise()
    .query(query2)
    .then(([rows, fields]) => {
      console.log('**************************************');
      console.log(rows.length + ' Employees found!');
      console.table('All Employees:', rows);
      console.log('**************************************');
      prompts();
    })
    .catch(console.log);
  // .then(() => exit());
}

// add an employee to the database
function addEmployee() {
  var query = 'SELECT * FROM role';
  connection
    .promise()
    .query(query)
    .then(([rows, fields]) => {
      inquirer
        .prompt([
          {
            name: 'first_name',
            type: 'input',
            message: "Please enter employee's first name? ",
          },
          {
            name: 'last_name',
            type: 'input',
            message: "Please enter employee's last name? ",
          },
          {
            name: 'manager_id',
            type: 'input',
            message: "Please enter employee's manager's ID? ",
          },
          {
            name: 'role',
            type: 'list',
            choices: function () {
              var roleArr = [];
              for (let i = 0; i < rows.length; i++) {
                roleArr.push(rows[i].title);
              }
              return roleArr;
            },
            message: "Select employee's role? ",
          },
        ])
        .then(function (answer) {
          var roleId;
          for (let i = 0; i < rows.length; i++) {
            if (rows[i].title == answer.role) {
              roleId = rows[i].id;
              //console.log(roleId);
            }
          }
          connection
            .promise()
            .query('INSERT INTO employee SET ?', {
              first_name: answer.first_name,
              last_name: answer.last_name,
              manager_id: answer.manager_id,
              role_id: roleId,
            })
            .then(() => {
              console.log('**************************************');
              console.table('Employee has been added! View all employees to confirm!');
              console.log('**************************************');
              prompts();
            })
            .catch(console.log);
          // .then(() => exit());
        });
    });
}
// add a new role to the database
function addRole() {
  var query = 'SELECT * FROM department';
  connection
    .promise()
    .query(query)
    .then(([rows, fields]) => {
      inquirer
        .prompt([
          {
            name: 'new_role',
            type: 'input',
            message: 'Enter the name of the role: ',
          },
          {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary of this role? (Enter a number)',
          },
          {
            name: 'Department',
            type: 'list',
            message: 'Select a department',
            choices: function () {
              var deptArry = [];
              for (let i = 0; i < rows.length; i++) {
                deptArry.push(rows[i].name);
              }
              return deptArry;
            },
          },
        ])
        .then(function (answer) {
          let department_id;
          for (let i = 0; i < rows.length; i++) {
            if (rows[i].name == answer.Department) {
              department_id = rows[i].id;
            }
          }

          connection
            .promise()
            .query('INSERT INTO role SET ?', {
              title: answer.new_role,
              salary: answer.salary,
              department_id: department_id,
            })
            .then(() => {
              console.log('**************************************');
              console.log('Your new role has been added! View all roles to confirm!');
              console.log('**************************************');
              prompts();
            });
        });
    });
}

// add a new department to the database
function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'deptName',
        type: 'input',
        message: 'Enter department name you would you like to add?',
      },
    ])
    .then(function (answer) {
      connection.query('INSERT INTO department SET ?', {
        name: answer.deptName,
      });
      var query = 'SELECT * FROM department';
      connection.query(query, function (err, res) {
        if (err) throw err;
        console.log('***********    New department has been added!   ***************');
        console.table('All Departments:', res);
        prompts();
      });
    });
}

// exit the app
function exit() {
  connection.end();
}
