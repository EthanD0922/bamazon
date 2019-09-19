DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE inventory (
    id INT NOT NULL AUTO_INCREMENT.
    name VARCHAR(30) NOT NULL,
    department VARCHAR(30) NOT NULL,
    price INT(10, 2) NOT NULL,
    in_stock INT(10) NOT NULL, 
    PRIMARY KEY(id)
) 

