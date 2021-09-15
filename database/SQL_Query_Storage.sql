/* Single Table Query's: */

/* Show all products */   
SELECT * FROM `productinformationtable`;

    /* Show product by ID */
    SELECT * FROM `productinformationtable`;
    WHERE product_id = 1;
    /* Show product By Name */
    SELECT * FROM `productinformationtable`
    WHERE product_name = "ApoHealth Paracetamol 500mg Caplets X 100";
    /* Show product by Group */
    SELECT * FROM `productinformationtable`
    WHERE product_group = "Cold, Cough & Flu";
    /* Show product by price range */
    SELECT * FROM `productinformationtable`
    WHERE product_price > 1 AND product_price < 5;

/* Show all deliveries */
SELECT * FROM `recievingTable`;

    /* Show all arrived deliveries */
    SELECT * FROM `recievingTable`
    WHERE arrived = 1;
    /* Show all incoming deliveries */
    SELECT * FROM `recievingTable` 
    WHERE arrived = 0;
    /* Show deliveries by Supplieer */
    SELECT * FROM `recievingTable` 
    WHERE supplier_id = 1;
    /* Show deliveries by Product */
    SELECT * FROM `recievingTable`  
    WHERE product_id = 1;
    /* Show deliveries by date (YYYY-MM-DD)*/
    SELECT * FROM `recievingTable` 
    WHERE delivery_date = "2021-09-12";

/* Show all orders */
SELECT * FROM `salesOrderTable`;

    /* Show all orders by product */ 
    SELECT * FROM `salesOrderTable`
    WHERE product_id = 1;
    /* Show all orders quanity range */
    SELECT * FROM `salesOrderTable`
    WHERE quantity_sold > 100;
    /* Show all orders by date */
    SELECT * FROM `salesOrderTable`
    WHERE date_time = "2021-09-14";
    /* Show all undispatched orders */
    SELECT * FROM `salesOrderTable`
    WHERE dispatched = 0;
    /* Show all dispacteed orders */
    SELECT * FROM `salesOrderTable`
    WHERE dispatched = 1;

/* Show all current inventory  */
SELECT * FROM `productInventoryTable`;

    /* Show inventory by product ID */
    SELECT * FROM `productInventoryTable`
    WHERE product_id = 1;
    /* Show inventory if below 100 */
    SELECT * FROM `productInventoryTable`
    WHERE current_stock <= 100;
    /* Show inventory if above 100 */
    SELECT * FROM `productInventoryTable`
    WHERE current_stock >= 100;
    /* Show maximum stock capactity*/
    SELECT * FROM `productInventoryTable`
    WHERE max_stock_capactity >= 1000;

/* Show all suppliers */
SELECT * FROM `supplierinformationtable`;

    /* Show Suppliers by ID */
    SELECT * FROM `supplierinformationtable`
    WHERE supplier_id = 1;
    /* Show Suppliers by Name */
    SELECT * FROM `supplierinformationtable`
    WHERE supplier_name = "Pharmacy Supplier Inc";
/* Show all users */
SELECT * FROM `authenticationtable`

    /* Show users by ID */
    SELECT * FROM `authenticationtable`
    WHERE user_id = 1;
    /* Show users by username */
    SELECT * FROM `authenticationtable`
    WHERE username = "admin";
    /* Show users by password */
    SELECT * FROM `authenticationtable`
    WHERE password = "$2b$10$0ynj8tx05yxmrx6cFbhphOe1iKmxmrjOxR.Lw85IfI7wsQ.eDDf0G";
    /* Show users by first_name */
    SELECT * FROM `authenticationtable`
    WHERE first_name = "admin";
    /* Show users by lastname */
    SELECT * FROM `authenticationtable`
    WHERE lastname = "super";
    /* Show users by admin privilege */
    SELECT * FROM `authenticationtable`
    WHERE isadmin = 1;
    /* Show users by non-admin privilege */
    SELECT * FROM `authenticationtable`
    WHERE isadmin = 0;

/* Multi Table Query's: */

/* Sales vs Inventory */
SELECT productInformationTable.product_id, product_name,productInventoryTable.date_time, current_stock, quantity_sold, product_price, ROUND(quantity_sold * product_price, 2) AS 'total_revenue'
FROM productInformationTable, productInventoryTable, salesOrderTable
WHERE productInformationTable.product_id = productInventoryTable.product_id
GROUP BY product_id;

/* Inventory + product */
SELECT productInformationTable.*, update_index, current_stock,max_stock_capacity, date_time 
FROM productInformationTable, productInventoryTable
WHERE productInformationTable.product_id = productInventoryTable.product_id
GROUP BY product_id;

/* Sales + product */
SELECT sales_id,productInformationTable.*,quantity_sold,date_time,dispatched, ROUND(quantity_sold * product_price, 2) AS 'total_revenue'
FROM productInformationTable, salesOrderTable
WHERE productInformationTable.product_id = salesOrderTable.product_id
ORDER BY date_time;

/* Select all products with current stock below 100 */
SELECT productInformationTable.product_id, product_name, current_stock, recievingTable.product_price AS 'Delivery Price'
FROM productInformationTable, productInventoryTable, recievingTable
WHERE current_stock < 100
GROUP BY productInformationTable.product_id

/* Sales by date */
SELECT productInventoryTable.product_id, salesOrderTable.date_time, current_stock, quantity_sold, product_price, ROUND(quantity_sold * product_price, 2) AS 'Total Revenue'
FROM productInventoryTable, salesOrderTable, productInformationTable
WHERE salesOrderTable.product_id = salesOrderTable.product_id
AND salesOrderTable.date_time = "2021-09-14"
AND salesOrderTable.dispatched = 1
GROUP BY productInventoryTable.product_id

/* Sales by month */
SELECT salesOrderTable.product_id, MONTH(salesOrderTable.date_time) AS 'Month', quantity_sold, product_price, ROUND(quantity_sold * product_price, 2) AS 'Total Revenue'
FROM  salesOrderTable, productInformationTable
WHERE salesOrderTable.product_id = salesOrderTable.product_id
AND salesOrderTable.dispatched = 1
GROUP BY salesOrderTable.product_id


/* Insert Query's: */

    /* Insert new product */
    /* Foreign Key Constraints Must add product before it can be sold or recieved */
    INSERT INTO `productinformationtable` (`product_id`, `product_name`, `product_group`, `product_description`, `product_price`)
    VALUES (NULL, 'MedicineTest1', 'MedicineGroupTest1', 'This is medicine', '4.99');
    /* Insert new product inventory */
    INSERT INTO `productinventorytable` (`update_index`, `product_id`, `current_stock`, `date_time`)
     VALUES (NULL, '2', '0', NULL);
    /* Insert new Sale */
    INSERT INTO `salesordertable` (`sales_id`, `product_id`, `quantity_sold`, `date_time`, `dispatched`) 
    VALUES (NULL, '2', '50', current_timestamp(), '1');
    /* Insert new supplier */
    INSERT INTO `supplierinformationtable` (`supplier_id`, `supplier_name`) 
    VALUES (NULL, 'SupplierTest1');
    /* Insert new delivery */
    INSERT INTO `recievingtable` (`recieving_id`, `supplier_id`, `product_id`, `delivery_date`, `product_price`, `quantity`, `arrived`) 
    VALUES (NULL, '1', '2', '2021-09-14', '1.25', '4000', '1');
    /* Insert new user */
    INSERT INTO `authenticationtable` (`user_id`, `password`, `first_name`, `last_name`, `admin`) 
    VALUES (NULL, '$2b$10$0ynj8tx05yxmrx6cFbhphOe1iKmxmrjOxR.Lw85IfI7wsQ.eDDf0G', 'admin', 'super', '1');

/* Update Query's: */

/* Update product */

    /* Update Product Table */

    /* Update product ID */
    UPDATE `productinformationtable` SET `product_id` = '3' 
    WHERE `productinformationtable`.`product_id` = 1;
    /* Update product name */
    UPDATE `productinformationtable` SET `product_name` = 'test' 
    WHERE `productinformationtable`.`product_id` = '1';
    /* Update product group */
    UPDATE `productinformationtable` SET `product_group` = 'Test'
    WHERE `productinformationtable`.`product_id` = '1';
    /* Update product description */
    UPDATE `productinformationtable` SET `product_description` = 'Test' 
    WHERE `productinformationtable`.`product_id` = 1;
    /* Update product price */
    UPDATE `productinformationtable` SET `product_price` = '2' 
    WHERE `productinformationtable`.`product_id` = 1;

    /* Update delivery */

    /* Update delivery ID */
    UPDATE `recievingtable` SET `recivingID` = '2'
    WHERE `recievingtable`.`recivingID` = 39;
    /* Update delivery supplier (Foriegn Key Restricted)*/
    UPDATE `recievingtable` SET `supplier_id` = '2' 
    WHERE `recievingtable`.`recivingID` = '2';
    /* Update delivery product */
    UPDATE `recievingtable` SET `product_id` = '1' 
    WHERE `recievingtable`.`recivingID` = '2';
    /* Update delivery date */
    UPDATE `recievingtable` SET `delivery_date` = '2021-09-15' 
    WHERE `recievingtable`.`recivingID` = '2';
    /* Update delivery price */
    UPDATE `recievingtable` SET `product_price` = '5.00' 
    WHERE `recievingtable`.`recivingID` = '2';
    /* Update delivery quantity */
    UPDATE `recievingtable` SET `quantity` = '3500' 
    WHERE `recievingtable`.`recivingID` = '2';
    /* Update delivery arrived */
    UPDATE `recievingtable` SET `arrived` = '0' 
    WHERE `recievingtable`.`recivingID` = 1;

    /* Update Sale */

    /* Update sale id */
    UPDATE `salesordertable` SET `sales_id` = '2' 
    WHERE `salesordertable`.`sales_id` = 4;
    /* Update sale product (Foreign Key Restricted)*/
    UPDATE `salesordertable` SET `product_id` = '1' 
    WHERE `salesordertable`.`sales_id` = '2';
    /* Update sale quantity */
    UPDATE `salesordertable` SET `quantity_sold` = '100' 
    WHERE `salesordertable`.`sales_id` = '2';
    /* Update sale date */
    UPDATE `salesordertable` SET `date_time` = '2021-09-15' 
    WHERE `salesordertable`.`sales_id` = '2';
    /* Update sale dispatched */
    UPDATE `salesordertable` SET `dispatched` = '0' 
    WHERE `salesordertable`.`sales_id` = '2';

    /* Update supplier */

    /* Update supplier id */
    UPDATE `supplierinformationtable` SET `supplier_id` = '3' 
    WHERE `supplierinformationtable`.`supplier_id` = 1;
    /* Update supplier name */
    UPDATE `supplierinformationtable` SET `supplier_name` = 'SupplierTest2' 
    WHERE `supplierinformationtable`.`supplier_id` = 2;

    /* Update user */

    /* Update user ID */
    UPDATE `authenticationtable` SET `user_id` = '2' 
    WHERE `authenticationtable`.`user_id` = 1;
    /* Update username */
    UPDATE `authenticationtable` SET `username` = 'admin1' 
    WHERE `authenticationtable`.`user_id` = '2';
    /* Update password */
    UPDATE `authenticationtable` SET `password` = '2b$10$0ynj8tx05yxmrx6cFbhphOe1iKmxmrjOxR.Lw85IfI7wsQ.eDDf0G' 
    WHERE `authenticationtable`.`user_id` = '1';
    /* Update first_name */
    UPDATE `authenticationtable` SET `first_name` = 'name' 
    WHERE `authenticationtable`.`user_id` = '1';
    /* Update lastname */
    UPDATE `authenticationtable` SET `lastName` = 'lastname' 
    WHERE `authenticationtable`.`user_id` = '1';
    /* Update isAdmin */
    UPDATE `authenticationtable` SET `isAdmin` = '0' 
    WHERE `authenticationtable`.`user_id` = '1';

/* Delete Query's: */

    /* Delete Product */
    /* All foreign keys cascade (Deleting a product will remove all foreign keys associated) */
    DELETE FROM `productinformationtable` WHERE product_id = 1;
    /* Delete Delivery */
    DELETE FROM `recievingTable` WHERE recivingID = 1;
    /* Delete Inventory */
    DELETE FROM `productinventorytable` WHERE updateIndex = 1;
    /* Delete Sale */
    DELETE FROM `salesordertable` WHERE sales_id = 1;
    /* Delete Supplier */
    DELETE FROM `supplierinformationtable` WHERE supplier_id = 1;
    /* Delete User */
    DELETE FROM `authenticationtable` WHERE user_id = 1;
