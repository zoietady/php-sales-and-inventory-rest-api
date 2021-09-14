CREATE TABLE recievingTable(
    recivingID int unsigned AUTO_INCREMENT not null,
    supplierID int not null,
    product_id int not null,
    deliveryDate DATE not null,
    product_price FLOAT not null,
    quantity int not null,
    arrived BOOLEAN not null,
    PRIMARY KEY (recivingID),
    FOREIGN KEY (supplierID) REFERENCES supplierInformationTable(supplierID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES productInformationTable(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX (supplierID),
    INDEX (product_id)
);

CREATE TABLE supplierInformationTable(
    supplierID int unsigned AUTO_INCREMENT not null,
    supplierName VARCHAR(50) not null,
    PRIMARY KEY (supplierID)
);

CREATE TABLE productInformationTable(
    product_id int AUTO_INCREMENT,
    product_name VARCHAR(50) not null,
    product_group VARCHAR(50) not null,
    product_description VARCHAR(50) not null,
    product_price FLOAT not null,
    PRIMARY KEY (product_id)
);

CREATE TABLE productInventoryTable (
    updateIndex INT unsigned AUTO_INCREMENT not null,
    product_id int,
    current_stock int not null,
    max_stock_capacity int not null,
    date_time TIMESTAMP,
    PRIMARY KEY (updateIndex),
    FOREIGN KEY (product_id) REFERENCES productInformationTable(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX (product_id)
);

CREATE TABLE salesOrderTable (
    sales_id INT unsigned AUTO_INCREMENT not null,
    product_id int,
    quantity_sold int not null,
    date_time DATE not null,
    dispatched BOOLEAN not null,
    PRIMARY KEY (sales_id),
    FOREIGN KEY (product_id) REFERENCES productInformationTable(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX (product_id)
);

CREATE TABLE authenticationTable(
    user_id INT unsigned AUTO_INCREMENT not null,
    password VARCHAR(500) not null,
    firstName VARCHAR(50) not null,
    lastName VARCHAR(50) not null,
    isAdmin BOOLEAN not null,
    PRIMARY KEY (user_id)
);
