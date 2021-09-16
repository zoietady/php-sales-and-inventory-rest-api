/* USER MODEL */

/* import connection instance */
const connection = require("./db.js");

/* user constructor */
const User = function(User) {
  this.user_id = User.user_id;
  this.first_name = User.first_name;
  this.last_name = User.last_name;
  this.admin = User.admin;
  this.password = User.password;
};

/* register/create user */
User.create = (newUser, result) => {
  connection.query("INSERT INTO authenticationtable SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created User: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

/* select user by id */
User.findById = (user_id, result) => {
  connection.query(`SELECT * FROM authenticationtable WHERE user_id = ${user_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found User: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

/* select user by id */
User.findByRole = (role, result) => {
  connection.query(`SELECT * FROM authenticationtable WHERE admin = ${role}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found User: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

/* select user by id */
User.findAdminById = (user_id, result) => {
  connection.query(`SELECT * FROM authenticationtable WHERE (user_id = ${user_id} AND admin = 1)`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found User: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

/* select all users */
User.getAll = result => {
  connection.query("SELECT * FROM authenticationtable", (err, res) => {
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
User.updateById = (id, user, result) => {
  connection.query( 'UPDATE authenticationtable SET ? WHERE user_id = ?',[user, id], (err, res) =>{
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return; 
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        console.log('failed');
        result({ kind: "not_found" }, null);
        return;
      }

      console.log('in call back');
      console.log("updated User: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};


/* select delete a user */
User.remove = (id, result) => {
  connection.query("DELETE FROM authenticationtable WHERE user_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted User with id: ", id);
    result(null, res);
  });
};

/*
User.removeAll = result => {
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

module.exports = User;