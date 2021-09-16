/* INVENTORY MODEL */

/* import connection instance */
const connection = require("./db.js");

/* instantiate Delivery model */
const Delivery = function(Delivery) {
  this.recieving_id = Delivery.recieving_id;
  this.supplier_id = Delivery.supplier_id;
  this.product_id = Delivery.product_id;
  this.delivery_date = Delivery.delivery_date;
  this.product_price = Delivery.product_price;
  this.quantity = Delivery.quantity;
  this.arrived = Delivery.arrived;
};

/* register/create Delivery */
Delivery.create = (newDelivery, result) => {
  connection.query("INSERT INTO recievingtable SET ?", newDelivery, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created Delivery: ", { id: res.insertId, ...newDelivery });
    result(null, { id: res.insertId, ...newDelivery });
  });
};

/* select Delivery by id */
Delivery.findById = (Delivery_id, result) => {
  connection.query(`SELECT * FROM recievingtable WHERE recieving_id = ${Delivery_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found Delivery: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Delivery with the id
    result({ kind: "not_found" }, null);
  });
};

/* select all Deliverys */
Delivery.getAll = result => {
  connection.query("SELECT * FROM recievingtable", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Deliverys: ", res);
    result(null, res);
  });
};

/* select all Deliverys */
Delivery.updateById = (id, delivery, result) => {
  connection.query( 'UPDATE recievingtable SET ? WHERE recieving_id = ?',[delivery, id], (err, res) =>{
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Delivery with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated Delivery: ", { id: id, ...delivery });
      result(null, { id: id, ...delivery });
    }
  );
};


/* select delete a Delivery */
Delivery.remove = (id, result) => {
  connection.query("DELETE FROM recievingtable WHERE recieving_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Delivery with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted Delivery with id: ", id);
    result(null, res);
  });
};

/*
Delivery.removeAll = result => {
  connection.query("DELETE FROM Deliverys", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} Deliverys`);
    result(null, res);
  });
};
*/

module.exports = Delivery;