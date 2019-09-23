var mysql = require("mysql");

var inquirer = require("inquirer");

var columnify = require("columnify");
        
var items

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
    items = []
    connection.query("SELECT * FROM inventory", function(err, res){
        for (var i = 0; i < res.length; i ++){
        items.push({id: res[i].id, name: res[i].name, department: res[i].department, price:res[i].price})
        }
        console.log(columnify(items, {columnSplitter: ' | '}))
    
        mainMenuCustomer()
    })
};

function mainMenuCustomer(){
    inquirer.prompt([{
        type: "list",
        message: "Welcome to Bamazon valued customer. What can i get for you today?",
        choices: items,
        name: "mainMenu"
    }]).then(function(res){
        var selection = res.mainMenu

        connection.query("SELECT * FROM inventory WHERE name = ?", selection, function(err, res){
            if (err) throw err;
            var cusotmerChoice = []
            cusotmerChoice.push({name: res[0].name, department: res[0].department, price:res[0].price})
            console.log(columnify(cusotmerChoice , {columnSplitter: ' | '}))
            buyAmount(res)
        })
    })
} 

function buyAmount(data){
    inquirer.prompt([{
                type: "input",
                message: "How many would you like to buy?",
                name: "buyItem"
            }]).then(function(response){
                if(response.buyItem > data[0].in_stock){
                    console.log("Sorry we dont have that many.");
                    buyAmount(data[0]);
                }
                else{
                    var newAmount = data[0].in_stock - response.buyItem;
                    var cost = data[0].price * response.buyItem;
                    var newSales = data[0].product_sales + cost;
                    connection.query("UPDATE inventory SET ? WHERE ?", [
                        {in_stock: newAmount, product_sales: newSales},
                        {id: data[0].id}],
                    function(err, res){
                        if(err) throw err;
                        console.log(newSales, data[0].product_sales)
                        console.log("Your total was: $" + cost);
                        returnToMain();
                    })
                }
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