DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE inventory (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    department VARCHAR(30) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    in_stock INT(10) NOT NULL,
    product_sales INT, 
    PRIMARY KEY(id)
);

INSERT INTO inventory (name, department, price, in_stock)
    values
        ("Headphones", "Electronics", 30.89, 30),
        ("Computer", "Electronics", 899.99, 10),
        ("CL4P-TP Steward Bot", "Electronics", 11.20, 1),
        ("Banana", "Grocery", 1.99, 200),
        ("Mac & Cheese", "Grocery", 2.99, 100),
        ("Murder on the Rockport Limited", "Book", 15.99, 80),
        ("Ulfgar Goes Punch", "Book", 10.65, 70), 
        ("Game of Thrones", "Book", 12.99, 100),
        ("Men's Pajama Pants", "Clothing", 6.99, 50),
        ("Women's Bootcut Jeans", "Clothing", 14.99, 50),
        ("Toothpaste", "Home", 13.99, 50),
        ("Toothbrush", "Home", 5.99, 50);


CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL, 
    over_head INT NOT NULL, 
    product_sales INT NOT NULL, 
    PRIMARY KEY(id) 
);

INSERT INTO department  (department_name, over_head, product_sales)
                values  ("Electronics", 3000, 5000),
                        ("Grocery", 2566, 3045),
                        ("Book", 1203, 1798),
                        ("Clothing", 1407, 1645),
                        ("Home", 1234, 2345);
