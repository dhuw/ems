const db = require("./db/connection");
const cTable = require('console.table');
const inquirer = require("inquirer");

//inquirer schtuff
const inquirerStart = () => {
    inquirer.createPromptModule([
        {
            type: "list",
            name: "toDo",
            message: "What would you like to do?",
            choices: [
                "View departments",
                "Add department",
                "View roles",
                "Add role",
                "View employees",
                "Add employee",
                "Update an employee's role",
                "Update an employee's manager",
                "View employees by manager",
                "View employees by department",
                "Remove department",
                "Remove role",
                "Remove employee",
                "Exit menu"
            ]
        }
    ])
    .then(answers => {
        const nextPrompt = answers.toDO;
        if (nextPrompt === "View departments") {
            viewDepartments();
        };
        if (nextPrompt === "View roles") {
            viewRoles();
        };
        if (nextPrompt === "View employees") {
            viewEmployees();
        };
        if (nextPrompt === "Add department") {
            addDepartment();
        };
        if (nextPrompt === "Add role") {
            addRole();
        };
        if (nextPrompt === "Add employee") {
            addEmployee();
        };
        if (nextPrompt === "Update an employee's role") {
            updateRole();
        };
        if (nextPrompt === "Update an employee's manager") {
            updateManager();
        };
        if (nextPrompt === "View employees by manager") {
            viewByManager();
        };
        if (nextPrompt === "View employees by department") {
            viewByDepartment();
        };
        if (nextPrompt === "Remove department") {
            removeDepartments();
        };
        if (nextPrompt === "Remove role") {
            removeRole();
        };
        if (nextPrompt === "Remove employee") {
            removeEmployee();
        };
        if (nextPrompt === "Exit menu") {
            process.exit();
        };
    })
};

const viewDepartments = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("\n");
        console.table(rows);
        return inquirerStart();
    });
};

const viewRoles = () => {
    const sql = `SELECT roles.id,
                        roles.title,
                        roles.salary,
                        departments.name AS department
                    FROM roles
                    LEFT JOIN departments ON roles.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("\n");
        console.table(rows);
        return inquirerStart();
    });
};

const viewEmployees = () => {
    const sql = `SELECT employees.id,
                        employees.first_name,
                        employees.last_name,
                        roles.title AS title,
                        roles.salary AS salary,
                        departments.name AS department,
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employees
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = department.id
                LEFT JOIN employees manager ON employees.manager_id = manager.id`
}