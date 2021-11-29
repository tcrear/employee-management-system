const inquirer = require('inquirer');
const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    }
);

db.connect((err) => {
    if(err) throw err;
    init()
})

function init() {
    inquirer.prompt(initQuestion)
    .then(({initAnswer}) => {
        if(initAnswer == "View All Employees") {
            viewEmployees()
        } else if (initAnswer == "View All Roles"){
            viewRoles()
        } else if (initAnswer == "View All Departments"){
            viewDepartments()
        } else if (initAnswer == "Add Employee"){
            addEmployee()
        } else if (initAnswer == "Add Role"){
            addRole()
        } else if (initAnswer == "Add Department"){
            addDepartment()
        } else if (initAnswer == "Update Employee Role"){
            updateEmployee()
        } else if (initAnswer == "Exit"){
            process.exit(1)
        }
    })
};

const initQuestion = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ["View All Employees", "View All Roles", "View All Departments", "Add Employee", "Add Role", "Add Department", "Update Employee Role", "Exit"],
        name: 'initAnswer'
    }
];

const addDepQuestion = [
    {
        type: 'input',
        message: 'Name of department?',
        name: 'addDepartmentAnswer'
    }
];


function viewEmployees() {
    db.query('SELECT * FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id' , function (err, results) {
        if (results){
            console.table(results);
            init();
        } else {
            console.log(err);
            init();
        };
    })
};

function viewRoles() {
    db.query('SELECT * FROM roles LEFT JOIN department ON roles.department_id = department.id' , function (err, results) {
        if (results){
            console.table(results);
            init();
        } else {
            console.log(err);
            init();
        };
    })
};

function viewDepartments() {
    db.query('SELECT * FROM department' , function (err, results) {
        if (results){
            console.table(results);
            init();
        } else {
            console.log(err);
            init();
        };
    })
};
       

function addDepartment() {
    inquirer.prompt(addDepQuestion)
    .then(({addDepartmentAnswer}) => {
        console.log(addDepartmentAnswer)
        db.query(`INSERT INTO department (department_name) VALUES ("${addDepartmentAnswer}")`, (err, results) => {
            if(err) throw err;
            init();
        })        

    })
};

function addEmployee() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id, title AS name FROM role`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
};

async function addEmployee() {
    let dbQueryRole = await addEmployee();
    let queryRole = dbQueryRole.map(({id, name}) => ({name: name, value: id}));

    let dbQueryManager = await addEmployee();
    let queryManager = dbQueryManager.map(({id, name}) => ({name: name, value: id}));

    inquirer.prompt([
        {
            type: 'input',
            message: "Employee First Name?",
            name: 'firstName'
        },
        {
            type: 'input',
            message: "Employee Last Name?",
            name: 'lastName'
        },
        {
            type: 'list',
            message: "Employee Role?",
            choices: queryRole, 
            name: 'empRole'
        },
        {
            type: 'list',
            message: "Employee Manager?",
            choices: queryManager,
            name: 'empManager'
        }
    ]).then(resp => {
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [resp.firstName, resp.lastName, resp.empRole, resp.empManager], (err, results) => {
            if (results){
                console.log('Employee added');
                init()
            } else {
                console.log(`Employee error`);
                init();
            }
        })
    })
}


function addRole() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM department', (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
};

function updateEmployee() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
};

init();

