/* Supplier MODEL */

/* import connection instance */
const connection = require("./db.js");

/* instantiate Supplier model */
const Supplier = function(supplier) {
  this.supplier_id = supplier.supplier_id;
  this.supplier_name = supplier.supplier_name;
};

/* register/create Supplier */
Supplier.create = (newSupplier, result) => {
  connection.query("INSERT INTO supplierinformationtable SET ?", newSupplier, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created Supplier: ", { id: res.insertId, ...newSupplier });
    result(null, { id: res.insertId, ...newSupplier });
  });
};

/* select Supplier by id */
Supplier.findById = (Supplier_id, result) => {
  connection.query(`SELECT * FROM supplierinformationtable WHERE Supplier_id = ${Supplier_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found Supplier: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Supplier with the id
    result({ kind: "not_found" }, null);
  });
};

/* select all Suppliers */
Supplier.getAll = result => {
  connection.query("SELECT * FROM supplierinformationtable", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Suppliers: ", res);
    result(null, res);
  });
};

/* select all Suppliers */
Supplier.updateById = (id, supplier, result) => {
  connection.query( 'UPDATE supplierinformationtable SET ? WHERE supplier_id = ?',[supplier, id], (err, res) =>{
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Supplier with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated Supplier: ", { id: id, ...supplier });
      result(null, { id: id, ...supplier });
    }
  );
};


/* select delete a Supplier */
Supplier.remove = (id, result) => {
  connection.query("DELETE FROM supplierinformationtable WHERE Supplier_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Supplier with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted Supplier with id: ", id);
    result(null, res);
  });
};

/*
Supplier.removeAll = result => {
  connection.query("DELETE FROM Suppliers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} Suppliers`);
    result(null, res);
  });
};
*/

module.exports = Supplier;