//inquirer

//
const mySql = require("mysql2");
const connection = mySql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "employees_db",
	port: 3306,
});

module.exports = connection;
