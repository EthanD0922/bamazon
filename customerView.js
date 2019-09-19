var mysql = require("mysql");

var inquirer = require("inquirer");

var columnify = require("columnify");
        
var items = []

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

    startApp();
});

function startApp(){
    connection.query("SELECT * FROM inventory", function(err, res){
        for (var i = 0; i < res.length; i ++){
        items.push({id: res[i].id, name: res[i].name, department: res[i].department, price:res[i].price, stock:res[i].in_stock})
        }
        console.log(columnify(items, {columnSplitter: ' | '}))
    
        mainMenu()
    })
};

function mainMenu(){
    inquirer.prompt([{
        type: "list",
        message: "Welcome to Bamazon valued customer. What can i get for you today?",
        choices: items,
        name: "mainMenu"
    }]).then(function(res){
        var selection = res.mainMenu

        connection.query("SELECT * FROM inventory WHERE name = ?", selection, function(err, res){
            if (err) throw err;
            console.log(columnify(res, {columnSplitter: ' | '}))
        })
    })
} 