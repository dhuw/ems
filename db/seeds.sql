INSERT INTO departments (department_name)
VALUES ("HR"),
       ("IT"),
       ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 100000, 1),
       ("Engineer", 90000, 2),
       ("Accountant", 80000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Smith", 1, NULL),
        ("Ben", "Pitroff", 2, 1),
       ("Bob", "Rob", 3, 1);