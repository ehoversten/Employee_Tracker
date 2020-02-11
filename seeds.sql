USE employee_tracker;

INSERT INTO departments(name)
VALUES ("Engineering"), 
("Human Resources"),
("Marketing"),
("Design"),
("Developer"),
("Intern");


INSERT INTO roles(title, salary, department_id)
VALUES ("Program Manager", 120000.00, 1),
("Junior Web Developer", 65000.00, 5),
("Web Developer", 85000.00, 5),
("Senior Web Developer", 98000.00, 5),
("Program Manager", 100000.00, 2),
("Web Designer", 75000.00, 4),
("Program Manager", 120000.00, 4);


INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ("Bill", "Gibbons", 1, NULL),
("Susan", "Thomas", 2, 1),
("Rachel", "Smith", 3, NULL),
("Gabe", "Wilson", 4, 1),
("Amy", "Jacobs", 2, 1),
("William", "Biggs", 5, NULL),
("Bill", "Wallerson", 4, 5);
