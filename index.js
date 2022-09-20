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





