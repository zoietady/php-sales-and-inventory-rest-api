/* PRODUCT MODEL */

/* import connection instance */
const connection = require("./db.js");

/* product constructor */
const Product = function(Product) {
  this.product_id = Product.product_id;
  this.product_name = Product.product_name;
  this.product_group = Product.product_group;
  this.product_description = Product.product_description;
  this.product_price = Product.product_price;
};

/* register/create Product */
Product.create = (newProduct, result) => {
  connection.query("INSERT INTO productinformationtable SET ?", newProduct, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created Product: ", { id: res.insertId, ...newProduct });
    result(null, { id: res.insertId, ...newProduct });
  });
};

/* select Product by id */
Product.findById = (Product_id, result) => {
  connection.query(`SELECT * FROM productinformationtable WHERE product_id = ${Product_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found Product: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Product with the id
    result({ kind: "not_found" }, null);
  });
};

/* select all Products */
Product.getAll = result => {
  connection.query("SELECT * FROM productinformationtable", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Products: ", res);
    result(null, res);
  });
};

/* select all Products */
Product.updateById = (id, Product, result) => {
  connection.query(
    "UPDATE productinformationtable SET product_name = ?, product_group = ?, product_description = ?, product_price = ? WHERE product_id = ?",
    [ Product.product_name, Product.product_group, Product.product_description, Product.product_price, Product.product_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Product with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated Product: ", { id: id, ...Product });
      result(null, { id: id, ...Product });
    }
  );
};


/* select delete a Product */
Product.remove = (id, result) => {
  connection.query("DELETE FROM productinformationtable WHERE product_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Product with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted Product with id: ", id);
    result(null, res);
  });
};

/*
Product.removeAll = result => {
  connection.query("DELETE FROM Products", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} Products`);
    result(null, res);
  });
};
*/

module.exports = Product;