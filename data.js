var sales = [
    {
        "sales_id": 1,
        "date_time": "2021-01-20", 
        "product_id": 0,
        "product_name": "test product 1",
        "product_group": "product group 1",
        "quantity_sold": 50,
        "product_sales_value": 5000
    },
    {
        "sales_id": 2,
        "date_time": "2021-01-21", 
        "product_id": 99999,
        "product_name": "test product 2",
        "product_group": "product group 2",
        "quantity_sold": 2,
        "product_sales_value": 10000
    }
];
var inventory = [
    {
        "product_id": 0,
        "product_name": "test product 1",
        "product_group": "product group 1",
        "max_stock_capacity": 100,
        "current_stock": 50,
        "product_description":"just a test product that is number 1",
        "product_price": 12.99
    },
    {
        "product_id": 999999,
        "product_name": "test product 2",
        "product_group": "product group 2",
        "max_stock_capacity": 200,
        "current_stock": 50,
        "product_description":"just a test product that is number 1",
        "product_price": 1200.99
    }
];
var users = [
    {   
        "user_id": 1,
        "first_name": "super",
        "last_name": "admin",
        "admin": true,
        "password": "$2b$10$0ynj8tx05yxmrx6cFbhphOe1iKmxmrjOxR.Lw85IfI7wsQ.eDDf0G"
    },
    {   
        "user_id": 2,
        "first_name": "regular",
        "last_name": "employee",
        "admin": false,
        "password": "$2b$10$nzViv5AKvX4Hrmom1Qj1getWkT8uOmukUUcSv77XPU3b6MGclAQ9i"
    }
];

var refershTokens = [];

module.exports = { 
    sales: sales,
    inventory: inventory,
    users: users,
    refershTokens: refershTokens
};