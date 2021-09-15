/* INVENTORY MODEL */

/* import connection instance */
const connection = require("./db.js");

/* instantiate user model */
const Inventory = function(Inventory) {
  this.update_index = Inventory.update_index;
  this.product_id = Inventory.product_id;
  this.current_stock = Inventory.current_stock;
  this.max_stock_capacity = Inventory.max_stock_capacity;
  this.date_time = Inventory.date_time;
};

/* register/create user */
Inventory.create = (newRecord, result) => {
  connection.query("INSERT INTO productinventorytable SET ?", newRecord, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created Inventory: ", { id: res.insertId, ...newRecord });
    result(null, { id: res.insertId, ...newRecord });
  });
};

/* select user by id */
Inventory.findById = (user_id, result) => {
  connection.query(`SELECT * FROM productinventorytable WHERE update_index = ${user_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found Inventory: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Inventory with the id
    result({ kind: "not_found" }, null);
  });
};

/* select all users */
Inventory.getAll = result => {
  connection.query("SELECT productInformationTable.*, update_index, current_stock,max_stock_capacity, date_time FROM productInformationTable, productInventoryTable WHERE productInformationTable.product_id = productInventoryTable.product_id GROUP BY product_id;", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Users: ", res);
    result(null, res);
  });
};

/* select all users */
Inventory.getAllBase = result => {
  connection.query("SELECT * FROM productinventorytable", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Users: ", res);
    result(null, res);
  });
};

/* select all users */
Inventory.updateById = (id, Inventory, result) => {
  connection.query(
    "UPDATE productinventorytable SET product_id = ?, current_stock = ?, max_stock_capacity = ?, date_time = ? WHERE update_index = ?",
    [ Inventory.product_id, Inventory.current_stock, Inventory.max_stock_capacity, Inventory.date_time, Inventory.update_index],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Inventory with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated Inventory: ", { id: id, ...Inventory });
      result(null, { id: id, ...Inventory });
    }
  );
};


/* select delete a user */
Inventory.remove = (id, result) => {
  connection.query("DELETE FROM productinventorytable WHERE update_index = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Inventory with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted Inventory with id: ", id);
    result(null, res);
  });
};

/*
Inventory.removeAll = result => {
  connection.query("DELETE FROM Users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} Users`);
    result(null, res);
  });
};
*/

module.exports = Inventory;