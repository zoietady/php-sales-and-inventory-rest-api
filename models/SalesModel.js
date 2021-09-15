/* SALES MODEL */

/* import connection instance */
const connection = require("./db.js");

/* instantiate Sales model */
const Sales = function(Sales) {
  this.sales_id = Sales.sales_id;
  this.product_id = Sales.product_id;
  this.quantity_sold = Sales.quantity_sold;
  this.date_time = Sales.date_time;
  this.dispatched = Sales.dispatched;
};

/* register/create Sales */
Sales.create = (newSales, result) => {
  connection.query("INSERT INTO salesordertable SET ?", newSales, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created Sales: ", { id: res.insertId, ...newSales });
    result(null, { id: res.insertId, ...newSales });
  });
};

/* select Sales by id */
Sales.findById = (Sales_id, result) => {
  connection.query(`SELECT * FROM salesordertable WHERE sales_id = ${Sales_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found Sales: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Sales with the id
    result({ kind: "not_found" }, null);
  });
};

/* select all Saless */
Sales.getAll = result => {
  connection.query("SELECT sales_id,productInformationTable.*,quantity_sold,date_time,dispatched, ROUND(quantity_sold * product_price, 2) AS 'total_revenue' FROM productInformationTable, salesOrderTable WHERE productInformationTable.product_id = salesOrderTable.product_id ORDER BY product_id;", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Saless: ", res);
    result(null, res);
  });
};

/* select all Saless */
Sales.getAllBase = result => {
  connection.query("SELECT * FROM salesordertable", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Saless: ", res);
    result(null, res);
  });
};

/* select all Saless */
Sales.updateById = (id, Sales, result) => {
  connection.query(
    "UPDATE salesordertable SET product_id = ?, quantity_sold = ?, date_time = ?, dispatched = ? WHERE sales_id = ?",
    [ Sales.product_id, Sales.quantity_sold, Sales.date_time, Sales.dispatched, Sales.sales_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Sales with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated Sales: ", { id: id, ...Sales });
      result(null, { id: id, ...Sales });
    }
  );
};


/* select delete a Sales */
Sales.remove = (id, result) => {
  connection.query("DELETE FROM salesordertable WHERE sales_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Sales with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted Sales with id: ", id);
    result(null, res);
  });
};

/*
Sales.removeAll = result => {
  connection.query("DELETE FROM Saless", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} Saless`);
    result(null, res);
  });
};
*/

module.exports = Sales;