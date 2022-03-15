CREATE TABLE departments (
  id INT NOT NULL PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);
CREATE TABLE role (
    id INT PRIMARY KEY,
	title VARCHAR(30) NOT NULL, 
    salary INT NOT NULL
   	department_ID INT NOT NULL,
);
CREATE TABLE employees (
	id INT NOT NULL PRIMARY KEY, 
    first_name VARCHAR(35) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL
);