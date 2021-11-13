INSERT INTO department (name)
VALUES 
('R&D'),
('Engineering'),
('Clinical'),
('HR'),
('Admin');


INSERT INTO role (title, salary, department_id)
VALUES 
('R&D Engineer', 300000, 1),  
('Software Engineer', 150000, 2), 
('Clinical Expert', 125000, 3), 
('HR Manager', 125000, 4), 
('Frontdesk executive', 800000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
('John', 'Doe', 1, 3), 
('Paul', 'Rudd', 2, 3), 
('Lorelai', 'Gilmore', 3 ,4), 
('Luke', 'Dane', 4, null), 
('Paola', 'Santiago', 5, 4);
