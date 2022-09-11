USE  company;
VALUES
("Sales"),
("Engineering"),
("Finace"),
("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES
("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Lead Engineer", 150000, 2),
("Software Engineer", 120000, 2),
("Accountant", 125000, 3),
("Legal Team Lead", 250000, 4),
("Lawyer", 190000, 4);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
("John", "Wick", 1),
("Michelle", "Forbes", 2),
("Mike", "Shapiro", 3),
("Dan", "Alexander", 4),
("Jon", "Patrick", 5),
("Mary", "Robbins", 6),
("Scott", "Dalton", 7),
("Robert", "Kennedy", 5),
("Jamesa", "Madison", 4),







