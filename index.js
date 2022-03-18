const inquirer = require("inquirer");
const mysql = require("mysql2");
const connection = require("./server");

connection.connect((err) => {
	if (err) throw err;
	initialize();
});

function initialize() {
	inquirer
		.prompt([
			{
				name: "action",
				type: "list",
				message: "What would you like to do?",
				choices: [
					"View all departments",
					"View all roles",
					"View all employees",
					"Add a new department",
					"Add a new role",
					"Add a new employee",
					"Update employee roles",
					"Quit",
				],
			},
		])
		.then(function (answer) {
			switch (answer.action) {
				case "View all departments":
					viewDepartments();
					break;
				case "View all roles":
					viewRoles();
					break;
				case "View all employees":
					viewEmployees();
					break;
				case "Add a new department":
					addDepartment();
					break;
				case "Add a new role":
					addRole();
					break;
				case "Add a new employee":
					addEmployee();
					break;
				case "Update employee roles":
					updateEmployee();
					break;
				case "Quit":
					connection.end();
					break;
			}
		});
}

viewDepartments = () => {
	connection.query(`SELECT * FROM department`, (err, res) => {
		if (err) throw err;
		console.table(res);
		initialize();
	});
};
viewRoles = () => {
	connection.query(`SELECT * FROM role`, (err, res) => {
		if (err) throw err;
		console.table(res);
		initialize();
	});
};
viewEmployees = () => {
	connection.query(`SELECT * FROM employee`, (err, res) => {
		if (err) throw err;
		console.table(res);
		initialize();
	});
};

addDepartment = () => {
	inquirer
		.prompt([
			{
				name: "deptName",
				type: "input",
				message: "Please name the department",
			},
		])
		.then(function (answer) {
			connection.query(`INSERT INTO department(name) VALUES ("${answer.deptName}")`);
			console.log(`${answer.deptName} department added!`);
			initialize();
		});
};

addRole = () => {
	connection.query(`SELECT * FROM department`, (err, res) => {
		if (err) throw err;
		inquirer
			.prompt([
				{
					name: "roleName",
					type: "input",
					message: "What is the title of the new role?",
				},
				{
					name: "salary",
					type: "input",
					message: `What is the salary of this role?`,
				},
				{
					name: "deptId",
					type: "list",
					message: "Please pick a department for the new role",
					choices: res.map((department) => department.name),
				},
			])
			.then(function (answer) {
				const grabDeptId = res.find((department) => department.name === answer.deptId);

				console.log(answer);
				connection.query(`INSERT INTO role SET ?`, {
					title: answer.roleName,
					salary: answer.salary,
					department_id: grabDeptId.id,
				});
				initialize();
			});
	});
};
addEmployee = () => {
	connection.query(`SELECT * FROM role`, (err, res) => {
		if (err) throw err;
		inquirer
			.prompt([
				{
					name: "employeeFirstName",
					type: "input",
					message: "Employee first name",
				},
				{
					name: "employeeLastName",
					type: "input",
					message: "Employee last name",
				},
				{
					name: "role",
					type: "list",
					message: `What role are they filling?`,
					choices: res.map((role) => role.title),
				},
			])
			.then(function (answer) {
				const convertRoleId = res.find((role) => role.title === answer.role);
				const firstName = answer.employeeFirstName;
				const lastName = answer.employeeLastName;

				connection.query(`SELECT * FROM employee`, (req, res) => {
					inquirer
						.prompt([
							{
								name: "managerId",
								type: "list",
								message: "Who is their manager?",
								choices: res.map((employee) => employee.first_name),
							},
						])
						.then((answer) => {
							const grabManagerId = res.find((employee) => employee.first_name === answer.managerId);

							console.log(answer);
							connection.query(`INSERT INTO employee SET ?`, {
								first_name: firstName,
								last_name: lastName,
								role_id: convertRoleId.id,
								manager_id: grabManagerId.id,
							});
							initialize();
						});
				});
			});
	});
};

updateEmployee = () => {
	connection.query(`SELECT * FROM employee`, (err, res) => {
		if (err) throw err;
		inquirer
			.prompt([
				{
					name: "employee",
					type: "list",
					message: "What employee would you like to update?",
					choices: res.map((employee) => employee.first_name),
				},
			])
			.then((answer) => {
				const employeeName = answer.employee;
				connection.query(`SELECT * FROM role`, (req, res) => {
					inquirer
						.prompt([
							{
								name: "newRole",
								type: "list",
								message: "select a new role:",
								choices: res.map((role) => role.title),
							},
						])
						.then((answer) => {
							const roleId = res.find((role) => role.title === answer.newRole);
							connection.query(`UPDATE employee SET ? WHERE first_name = ` + "'" + employeeName + "'", {
								role_id: roleId.id,
							});
							initialize();
						});
				});
			});
	});
};
