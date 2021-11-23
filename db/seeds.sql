USE employees_db;

INSERT INTO department (department_name)
VALUES  ("Engineering"),
        ("Finance"),
        ("Legal"),
        ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Lead", 100000, 4),
        ("Salesperson", 80000, 4),
        ("Lead Engineer", 150000, 1),
        ("Software Engineer", 120000, 1),
        ("Account Manager", 160000, 2),
        ("Accountant", 125000, 2),
        ("Legal Team Lead", 250000, 3),
        ("Lawyer", 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Ashley", "Hanson", 2, 1),
        ("Lisa", "Riley", 4, 3),
        ("Jenny", "Leech", 6, 5),
        ("Jeanna", "Somers", 8, 7),
        ("Emily", "Mathis", 1, null),
        ("Caroline", "Sanderson", 3, null,
        ("Mary", "Olson", 5, null),
        ("Geoff", "Richards", 7, null);