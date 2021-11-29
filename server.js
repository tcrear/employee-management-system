const inquirer = require('inquirer');
const mysql = require('mysql2');
// const consoletable = require('console.table');


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
}

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
        message: 'What is the name of the department?',
        name: 'addDepartmentAnswer'
    }
];

const addRoleQuestion = [
    {
        type: 'input',
        message: 'What is the name of the role?',
        name: 'addDepartmentAnswer'
    }
];

const addDepQuestion = [
    {
        type: 'input',
        message: 'What is the name of the department?',
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




function addEmployee() {


function addRole() {

        

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

function updateEmployee() {
    


};