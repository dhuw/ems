INSERT INTO departments (department_name)
VALUES ("HR"),
       ("IT"),
       ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 100000, 1),
       ("Engineer", 90000, 2),
       ("Accountant", 80000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Wick", 1, NULL),
        ("Ariana", "Grande", 2, 1),
       ("Peter", "Griffin", 3, 1);