const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'company_db',
},
console.log(`Connected to the database.`)
);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          'View all department',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ])
    .then((answers) => {
      switch (answers.choice) {
        case 'View all department':
          viewAllDepartment();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          db.end();
          process.exit(0);
          break;
      }
    });
}

function viewAllDepartment() {
  db.query('SELECT * FROM department', (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(results);
    mainMenu();
  });
}

function viewAllRoles() {
  db.query('SELECT * FROM roles', (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(results);
    mainMenu();
  });
}

function viewAllEmployees() {
  db.query('SELECT * FROM employee', (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(results);
    mainMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: 'Enter the name of the new department:',
      },
    ])
    .then((answers) => {
      db.query('INSERT INTO department (name) VALUES (?)', [answers.departmentName], (err, results) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Department added successfully.');
        }
        mainMenu();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the new role:',
      },
      {
        type: 'number',
        name: 'salary',
        message: 'Enter the salary for the new role:',
      },
      {
        type: 'number',
        name: 'department_id',
        message: 'Enter the department ID for the new role:',
      },
    ])
    .then((answers) => {
      db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, answers.department_id], (err, results) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Role added successfully.');
        }
        mainMenu();
      });
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the new employee:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the new employee:',
      },
      {
        type: 'number',
        name: 'role_id',
        message: 'Enter the role ID for the new employee:',
      },
      {
        type: 'number',
        name: 'manager_id',
        message: 'Enter the manager ID for the new employee (leave empty if none):',
      },
    ])
    .then((answers) => {
      db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id || null], (err, results) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Employee added successfully.');
        }
        mainMenu();
      });
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: 'number',
        name: 'employee_id',
        message: 'Enter the ID of the employee you want to update:',
      },
      {
        type: 'number',
        name: 'new_role_id',
        message: 'Enter the new role ID for the employee:',
      },
    ])
    .then((answers) => {
      db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.new_role_id, answers.employee_id], (err, results) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Employee role updated successfully.');
        }
        mainMenu();
      });
    });
}
