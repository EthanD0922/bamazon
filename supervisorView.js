var mysql = require("mysql");

var inquirer = require("inquirer");

var columnify = require("columnify");
        
var items = []

var departments = []

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "1234",
    database: "bamazon_DB"
  });

connection.connect(function(err){
    if (err) throw err;

    console.log("Connected as id " + connection.threadId)

    connection.query("SELECT department_name FROM department", function(err, res){
        for( var i = 0; i <res.length; i ++){
            departments.push(res[i].department_name)
        }
    })

    startApp();
});

function startApp(){
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome to Bamazon Supervisor View. What can I do for you?",
            choices: ["View Sales by Department", "Create New Department"],
            name: "supervisor"
        }
    ]).then(function(res){
        if(res.supervisor === "View Sales by Department"){
            departmentSales();
        }
        else {
            newDepartment();
        }
    })
};

function departmentSales(){
    inquirer.prompt([
        {
            type: "list",
            message: "Which Department?",
            choices: departments,
            name: "department"
        }
    ]).then(function(res){
        connection.query("SELECT department_name, over_head, (sum(inventory.product_sales) + department.product_sales) AS product_sales, (sum(inventory.product_sales) + department.product_sales - over_head) AS profits FROM inventory INNER JOIN department ON inventory.department = department.department_name WHERE department = ?", res.department,
        function(err, res){
            if (err) throw err;
            console.log(columnify(res, {columnSplitter: ' | '}))
            returnToMain();
        })
    })
}

function newDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "Department Name?",
            name: "depName",
        },
        {
            type: "input",
            message: "What will the Over Head be for this department?",
            name: "depOH"
        }
    ]).then(function(res){
        connection.query("INSERT INTO department (department_name, over_head, product_sales) values( ?, ?, 0)", [res.depName, res.depOH],function(err, response){
            if (err) throw err;
            console.log(res.depName + " has been added to Bamazon")
            returnToMain();
        })
    })
}

function returnToMain(){
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to return to the Menu?",
            name: "menu",
            default: true
        }
    ]).then(function(res){
        if (res.menu){
            startApp();
        }
        else{
            connection.end();
        }
    })
}