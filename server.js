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

const addEmpQuestion = [
    {
        type: 'input',
        message: 'Name of Employee?',
        name: 'addEmpAnswer'
    }
];

function addEmployee() {
    inquirer.prompt(addEmpQuestion)
    .then(({addEmpAnswer}) => {
        console.log(addEmpAnswer)
        db.query(`INSERT INTO department (department_name) VALUES ("${addEmpAnswer}")`, (err, results) => {
            if(err) throw err;
            init();
        })        

    })
};

const addDepartmentQuestion = [
    {
        type: 'input',
        message: 'Name of department?',
        name: 'addDepartmentAnswer'
    }
];

function addDepartment() {
    inquirer.prompt(addDepartmentQuestion)
    .then(({addDepartmentAnswer}) => {
        console.log(addDepartmentAnswer)
        db.query(`INSERT INTO department (department_name) VALUES ("${addDepartmentAnswer}")`, (err, results) => {
            if(err) throw err;
            init();
        })        

    })
};

const addRoleQuestion = [
    {
        type: 'input',
        message: 'Name of role?',
        name: 'addRoleAnswer'
    }
];

function addRole() {
    inquirer.prompt(addRoleQuestion)
    .then(({addRoleAnswer}) => {
        console.log(addRoleAnswer)
        db.query(`INSERT INTO department (department_name) VALUES ("${addRoleAnswer}")`, (err, results) => {
            if(err) throw err;
            init();
        })        
    })
};

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
    

function addEmployee() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id, title AS name FROM roles`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
};

function addEmployeeQuery() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id, title AS name FROM roles`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
};

function addEmployeeQueryManager() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id, manager_id, CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
};

async function addEmployee() {
    let dbQueryEmp = await addEmployeeQuery();
    let queryChoicesEmp = dbQueryEmp.map(({id, name}) => ({name: name, value: id}));

    let dbQueryMgr = await addEmployeeQueryManager();
    let queryChoicesMgr = dbQueryMgr.map(({id, name}) => ({name: name, value: id}));

    inquirer.prompt([
        {
            type: 'input',
            message: "Employee first name?",
            name: 'empFirstName'
        },
        {
            type: 'input',
            message: "Employee last name",
            name: 'empLastName'
        },
        {
            type: 'list',
            message: "Employee Role?",
            choices: queryChoicesEmp, 
            name: 'empRole'
        },
        {
            type: 'list',
            message: "Manager Name?",
            choices: queryChoicesMgr, 
            name: 'empManager'
        }
    ]).then(resp => {
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [resp.empFirstName, resp.empLastName, resp.empRole, resp.empManager], (err, results) => {
            if (results){
                console.log('Employee added');
                init()
            } else {
                console.log(`Employee error`);
                init();
            }
        })
    })
};


function addRoleNew() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM department', (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
};

async function addRole() {
    let dbQuery = await addRoleNew();
    let queryAnswer = dbQuery.map(({id, name}) => ({name: name, value: id}))
    inquirer.prompt([
        {
            type: 'input',
            message: 'Role Name?',
            name: 'nameRole'
        },
        {
            type: 'number',
            message: 'Salary for role?',
            name: 'salaryRole'
        },
        {
            type: 'list',
            message: 'Department of role?',
            choices: queryAnswer,
            name: 'departmentRole'
        }
    ]).then(resp => {
        db.query('INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)', [resp.nameRole, resp.salaryRole, resp.departmentRole], (err, results) => {
            if (results){
                console.log('Role added');
                init();
            } else {
                console.log(`Role error`);
                init();
            }
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


function updateEmployeeQuery() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
};

function updateEmployeeQueryRole() {
    return new Promise((resolve, reject) => {
        db.query('SELECT id, title AS name FROM roles', (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
};

async function updateEmployee() {
    let dbQueryEmpUpdate = await updateEmployeeQuery();
    let queryUpdate = dbQueryEmpUpdate.map(({id, name}) => ({name: name, value:id})) 

    let dbQueryRole = await updateEmployeeQueryRole();
    let queryRole = dbQueryRole.map(({id, name}) => ({name: name, value:id}))

    inquirer.prompt([
        {
            type: 'list',
            message: "Select the employee that you would like to update?",
            choices: queryUpdate,
            name: 'empName'
        },
        {
            type: 'list',
            message: 'Select new role?',
            choices: queryRole,
            name: 'empRoleNew'
        }
    ]).then(resp => {
        db.query('UPDATE employee SET role_id = (?)  WHERE id = (?)', [resp.empRoleNew, resp.empName], (err, results) => {
            if (results){
                console.log('Employee updated');
                init();
            } else {
                console.log(`Employee error`);
                init();
            }
        })
    })
};

init();