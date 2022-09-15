const db = require("../db/connection");
//const cTable = require('console.table');
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
//view departments func
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
//view roles func
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
// view employees func
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
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("\n");
        console.table(rows);
        return inquirerStart(); 
    });
};
//add department func
const addDepartment = () => {
    return inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of this department?",
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter a department name");
            return false;
          };
        }
      }
    ])
    .then(answer => {
      const sql = `INSERT INTO departments (name)
        VALUES (?)`;
      const params = answer.name;
      db.query(sql, params, (err) => {
        if (err) {
          throw err;
        }
        console.log("Department added!");
        return viewDepartments();
      });
    });
};
//add role func
const addRole = () => {
    return inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of this role?",
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter a role name");
            return false;
          };
        }
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?",
        validate: salaryInput => {
          if (isNaN(salaryInput)) {
            console.log("Please enter a salary");
            return false;
          } else {
            return true;
          };
        }
      }
    ])
    .then (answer => {
      const params = [answer.title, answer.salary];
      const sql = `SELECT * FROM departments`;
      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        const departments = rows.map(({name, id}) => ({name: name, value: id}));
        inquirer.prompt([
          {
            type: "list",
            name: "department",
            message: "What department does this role belong to?",
            choices: departments
          }
        ])
        .then(departmentAnswer => {
          const department = departmentAnswer.department;
          params.push(department);
          const sql = `INSERT INTO roles (title, salary, department_id)
            VALUES (?, ?, ?)`;
          db.query(sql, params, (err) => {
            if (err) {
              throw err;
            }
            console.log("Role added!");
            return viewRoles();
          });
        });
      });
    });
};
//add employee func
const addEmployee = () => {
    return inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter a name");
            return false;
          };
        }
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter a name");
            return false;
          };
        }
      }
    ])
    .then (answer => {
      const params = [answer.firstName, answer.lastName];
      const sql = `SELECT * FROM roles`;
      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        const roles = rows.map(({title, id}) => ({name: title, value: id}));
        inquirer.prompt([
          {
            type: "list",
            name: "role",
            message: "What is the role of this employee?",
            choices: roles
          }
        ])
        .then(roleAnswer => {
          const role = roleAnswer.role;
          params.push(role);
          const sql = `SELECT * FROM employees`;
          db.query(sql, (err, rows) => {
            if (err) {
              throw err;
            }
            const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
            managers.push({name: "No manager", value: null});
            inquirer.prompt([
              {
                type: "list",
                name: "manager",
                message: "Who is this employee's manager?",
                choices: managers
              }
            ])
            .then(managerAnswer => {
              const manager = managerAnswer.manager;
              params.push(manager);
              const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
              db.query(sql, params, (err) => {
                if (err) {
                  throw err;
                }
                console.log("Employee added!");
                return viewEmployees();
              });
            });
          });
        });
      });
    });
};
//update employee role func
const updateRole = () => {
    const sql = `SELECT first_name, last_name, id FROM employees`
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee's role would you like to update?",
          choices: employees
        }
      ])
      .then(employeeAnswer => {
        const employee = employeeAnswer.employee;
        const params = [employee];
        const sql = `SELECT title, id FROM roles`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          const roles = rows.map(({title, id}) => ({name: title, value: id}));
          inquirer.prompt([
            {
              type: "list",
              name: "role",
              message: "What is the new role of this employee?",
              choices: roles
            }
          ])
          .then(rolesAnswer => {
            const role = rolesAnswer.role;
            params.unshift(role);
            const sql = `UPDATE employees
                          SET role_id = ?
                          WHERE id = ?`
            db.query(sql, params, (err) => {
              if (err) {
                throw err;
              }
              console.log("Employee updated!");
              return viewEmployees();
            });
          });
        });
      });
    });
};
//update employee manager func
const updateManager = () => {
    const sql = `SELECT first_name, last_name, id FROM employees`
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
      .then(employeeAnswer => {
        const employee = employeeAnswer.employee;
        const params = [employee];
        const sql = `SELECT first_name, last_name, id FROM employees`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
          managers.push({name: "No manager", value: null});
          inquirer.prompt([
            {
              type: "list",
              name: "manager",
              message: "Who is this employee's new manager?",
              choices: managers
            }
          ])
          .then(managerAnswer => {
            const manager = managerAnswer.manager;
            params.unshift(manager);
            const sql = `UPDATE employees
                          SET manager_id = ?
                          WHERE id = ?`
            db.query(sql, params, (err) => {
              if (err) {
                throw err;
              }
              console.log("Employee updated!");
              return viewEmployees();
            });
          });
        });
      });
    });
};
//view employees by manager func
const viewByManager = () => {
    const sql = `SELECT first_name, last_name, id FROM employees`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "employee",
          message: "Which manager's employees would you like to view?",
          choices: employees
        }
      ])
      .then(employeeAnswer => {
        const manager = employeeAnswer.employee;
        const params = [manager];
        const sql = `SELECT id, first_name, last_name FROM employees
                      WHERE manager_id = ?`
        db.query(sql, params, (err, rows) => {
          if (err) {
            throw err;
          }
          if (rows.length === 0) {
            console.log("This employee does not manage anyone.");
            return startInquirer();
          }
          console.log("\n");
          console.table(rows);
          return startInquirer();
        });
      });
    });
};
//view by department func
const viewByDepartment = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        const departments = rows.map(({name, id}) => ({name: name, value: id}));
        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which department's employees would you like to view?",
                choices: departments
            }
        ])
        .then(employeeAnswer => {
            const department = employeeAnswer.employee;
            const params = [department];
            const sql = `SELECT employees.id, first_name, last_name, departments.name AS department
                            FROM employee
                            LEFT JOIN roles ON employees.role_id = roles.id
                            LEFT JOIN departments ON roles.department_id = departments.id
                            WHERE departments.id = ?`;
            db.query(sql, params, (err, rows) => {
                if (err) {
                    throw err;
                }
                console.log("\n");
                console.table(rows);
                return inquirerStart();
            });
        });
    });
};

// remove department func
const removeDepartment = () => {
  const sql = `SELECT * FROM departments`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const departments = rows.map(({name, id}) => ({name: name, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "department",
        message: "Which department would you like to remove?",
        choices: departments
      }
    ])
    .then(departmentAnswer => {
      const department = departmentAnswer.department
      const params = department;
      const sql = `DELETE FROM departments
                    WHERE id = ?`
      db.query(sql, params, (err) => {
        if (err) {
          throw err;
        }
        console.log("Department deleted!");
        return viewDepartments();
      });
    });
  });
};

//remove role func
const removeRole = () => {
  const sql = `SELECT id, title FROM roles`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const roles = rows.map(({title, id}) => ({name: title, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: "Which role would you like to remove?",
        choices: roles
      }
    ])
    .then(roleAnswer => {
      const role = roleAnswer.role
      const params = role;
      const sql = `DELETE FROM roles
                    WHERE id = ?`
      db.query(sql, params, (err) => {
        if (err) {
          throw err;
        }
        console.log("Role deleted!");
        return viewRoles();
      });
    });
  });
};

// remove employee func
const removeEmployee = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee would you like to remove?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const employee = employeeAnswer.employee
      const params = employee;
      const sql = `DELETE FROM employees
                    WHERE id = ?`
      db.query(sql, params, (err) => {
        if (err) {
          throw err;
        }
        console.log("Employee removed!");
        return viewEmployees();
      });
    });
  });
};

module.exports = startInquirer;