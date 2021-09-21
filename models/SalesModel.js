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

    console.log("created Sales: ", { sales_id: res.insertId, ...newSales });
    result(null, { sales_id: res.insertId, ...newSales });
  });
};

/* register/create Sales */
Sales.createMany = (newSalesList, result) => {
  console.log(newSalesList);
  connection.query("INSERT INTO salesordertable (product_id, quantity_sold, date_time, dispatched) VALUES ?", [newSalesList], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("List of sales record inserted ");
    result(null, { sales_id: res.insertId });
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
  connection.query("SELECT sales_id,productinformationtable.*,quantity_sold,date_time,dispatched, ROUND(quantity_sold * product_price, 2) AS 'total_revenue' FROM productinformationtable, salesordertable WHERE productinformationtable.product_id = salesordertable.product_id ORDER BY product_id;", (err, res) => {
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
Sales.updateById = (id, sales, result) => {
  connection.query( 'UPDATE salesordertable SET ? WHERE sales_id = ?',[sales, id], (err, res) =>{
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

      console.log("updated Sales: ", { sales_id: id, ...sales });
      result(null, { sales_id: id, ...sales });
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