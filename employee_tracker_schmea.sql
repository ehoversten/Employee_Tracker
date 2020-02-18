
DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE departments(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(7, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE employees(
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT DEFAULT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE CASCADE
);



-- QUERY COMMANDS

-- View Titles and Salay by Department (Sort Highest to Lowest)
SELECT name AS Department, title AS 'Job Title', salary AS Salary
FROM departments, roles
WHERE departments.id = roles.department_id
ORDER BY salary DESC;

-- Same query as above only using JOINS (Sorted by Department name and then highest to lowest by salary)
SELECT name AS Department, title, salary
FROM departments
    JOIN roles ON departments.id = roles.department_id
ORDER BY name, roles.salary DESC;



-- View All Employees By Manager
SELECT employees.id, first_name AS First, last_name AS Last
FROM employees
WHERE manager_id = 1;



-- Find all Employees include Role and  Department
SELECT employees.id, first_name AS First, last_name AS Last, title AS Title, name AS Department, salary AS Salary
FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id;



-- Find all Employees by Department
SELECT departments.id, name AS Department, title AS Title, first_name AS First, last_name AS Last
FROM departments
    JOIN roles ON departments.id = roles.department_id
    JOIN employees ON roles.id = employees.role_id
WHERE departments.name = 'Developer';

-- Update Employee Manager




SELECT employees.id, employees.first_name AS First, employees.last_name AS Last, roles.title AS Title, departments.name AS Department, roles.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS 'Direct Manager'
FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    JOIN employees manager ON manager.id = employees.manager_id;