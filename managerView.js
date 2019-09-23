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
                selectInventory();
                break;

            case "Add New Product":
                addProducts();
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
        returnToMain();
    })
}

function viewLow(){
    connection.query("SELECT * FROM inventory WHERE in_stock <= 10", function(err, res){
        var lowInv = []
        for (var i = 0; i <res.length; i ++ ){
            lowInv.push({id: res[i].id, name: res[i].name, department: res[i].department, price:res[i].price, stock:res[i].in_stock})
        }
        console.log(columnify(lowInv, {columnSplitter: ' | '}))
        returnToMain();
    })

}

function selectInventory(){
    connection.query("SELECT * FROM inventory", function(err, res){
        for (var i = 0; i < res.length; i ++){
            items.push({id: res[i].id, name: res[i].name, department: res[i].department, price:res[i].price, stock:res[i].in_stock})
        }
    
    inquirer.prompt([{
        type: "list",
        message: "Which Product can we order more of?",
        choices: items,
        name: "addInv"
    }]).then(function(res){
        var selection = res.addInv

        connection.query("SELECT * FROM inventory WHERE name = ?", selection, function(err, res){
            if (err) throw err;
            console.log(columnify(res, {columnSplitter: ' | '}))
            addInventory(res);
        });
    });
});
}

function addInventory(data){
    inquirer.prompt([
        {
            type: "input",
            message: "How many would you like to order?",
            name: "orderCount"
        }
    ]).then(function(response){
        
        var newAmount = data[0].in_stock + response.orderCount;
        
        connection.query("UPDATE inventory SET ? WHERE ?", [
            {in_stock: newAmount},
            {id: data[0].id}],
        function(err, res){
            if(err) throw err;
            console.log(response.orderCount + " of " + data[0].name + " have been order. We will have " + newAmount + " total.");
            returnToMain();
        })
    })
}

function addProducts(){
    inquirer.prompt([
        {
            type:"input",
            message: "What product would you like to add?",
            name: "productName"
        },
        {
            type:"input",
            message: "What department is this product for?",
            name: "departmentName"
        },
        {
            type:"input",
            message: "How much will it cost??",
            name: "productPrice"
        },
        {
            type:"input",
            message: "How many should we order??",
            name: "orderAmount"
        }
    ]).then(function(res){
        connection.query("INSERT INTO inventory SET ?",
        {
            name: res.productName,
            department: res.departmentName,
            price: res.productPrice,
            in_stock: res.orderAmount
        },
        function(err, response){
            if(err) throw err;
            console.log(res.productName + " has been added to our stock.")
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