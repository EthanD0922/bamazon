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
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome to Bamazon Manager View. What can I do for you?",
            choices: ["View Products", "View Low Inventory", "Add To Inventory", "Add New Product"],
            name: "manager"
        }
])  .then(function(res){
    var selection = res.manager

        switch (selection){
            case "View Products":
                viewProducts();
                break;
            
            case "View Low Inventory":
                viewLow();
                break;

            case "Add To Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;

            case "Exit":
                connection.end();
                break;
        }   
    })
};

function viewProducts(){
    connection.query("SELECT * FROM inventory", function(err, res){
        for (var i = 0; i < res.length; i ++){
        items.push({id: res[i].id, name: res[i].name, department: res[i].department, price:res[i].price, stock:res[i].in_stock})
        }
        console.log(columnify(items, {columnSplitter: ' | '}))
    })
}

function viewLow(){

}

function addInventory(){

}

function addProducts(){

}

function returnToMain(){
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to return to the Menu or exit?",
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