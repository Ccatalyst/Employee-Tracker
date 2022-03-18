USE employees_db;

INSERT INTO department(name)
VALUES ("Manufacturing"),
("Human Resources"),
("Customer Service");


INSERT INTO role(title, salary, department_id)
VALUES ("Welder", 32000, 1),
    ("Labor", 20000, 2);


INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Matthew", "Todor", 2, 1);





