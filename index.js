const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    }
);

// inquirer setup
const promptInit = () => {
    inquirer.prompt
    ([{
        type: 'list',
        name: 'answer',
        message: "What would you like to do?",
        choices: [
            "View departments",
            "View roles",
            "View employees",
            "Add department",
            "Add role",
            "Add employee",
            "Update employee role"
        ]
    }])
    .then((data) => {
        switch (data.answer) {
            case "View departments":
                showDepartments();
                break;
            case "View roles":
                showRoles();
                break;
            case "View employees":
                showEmployees();
                break;
            case "Add department":
                promptNewDep();
                break;
            case "Add role":
                promptNewRole();
                break;
            case "Add employee":
                promptNewEmployee();
                break;
            case "Update employee role":
                updateEmployee();
                break;
        }
    })
    .catch((err) => console.error(err));
};

// prompts amd var define

const promptNewDep = () => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: "Input the new department name",
        }
      ])
      .then((val) => {
        createDepartment(val.name)
      })
      .catch((err) => console.error(err));
  };
  
  const promptNewRole = () => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: "Input the new Role title",
        },
        {
          type: 'input',
          name: 'salary',
          message: "Input the new Role salary",
        },
        {
          type: 'list',
          name: 'dept',
          message: "Select which department this role is part of",
          choices: deptArray
        }
      ])
      .then((val) => {
        createRole(val.title, val.salary, val.dept);
      })
      .catch((err) => console.error(err));
  };
  
  const promptNewEmployee = () => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "Input the employee's first name",
        },
        {
          type: 'input',
          name: 'lastName',
          message: "Input the employees last name",
        },
        {
          type: 'list',
          name: 'role',
          message: "Select the role this employee will have",
          choices: roleArray
        },
        {
          type: 'list',
          name: 'manager',
          message: "Select the manager this employee will have",
          choices: managerArray
        }
      ])
      .then((val) => {
        createEmployee(val.firstName, val.lastName, val.role, val.manager);
      })
      .catch((err) => console.error(err));
  };
  
  
  function updateEmployee(){
      inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee',
          message: "Select which employee to update",
          choices: employeeArray
        },
        {
          type: 'list',
          name: 'role',
          message: "Select a role to update for this employee",
          choices: roleArray
        }
      ])
      .then((val) => {
        modifyEmployee(val.employee, val.role);
      })
      .catch((err) => console.error(err));
  };
  
  function promptContinue() {
    inquirer.prompt(
      {
        type: 'list',
        name: 'answer',
        message: "Continue?",
        choices: ["yes", "no"]
      }
    )
      .then(val => {
        if (val.answer === "yes") {
          promptInit();
        } else {
          db.end();
        }
      });
  }
  
  const init = () => {
    promptInit();
  }

  //query func
  function showDepartments() {
    console.log("Showing department table")
    db.promise().query('SELECT * FROM departments')
      .then(([rows, fields]) => {
        console.table(rows);
        promptContinue()
      })
      .catch(console.log)      
  }
  
  function showRoles() {
    console.log("Showing roles table")
    db.promise().query('SELECT * FROM roles')
      .then(([rows, fields]) => {
        console.table(rows);
        promptContinue()
      })
      .catch(console.log)
  }
  
  function showEmployees() {
    console.log("Showing employees table")
    db.promise().query('SELECT * FROM employees')
      .then(([rows, fields]) => {
        console.table(rows);
        promptContinue()
      })
      .catch(console.log)
  }

