const User = require("../models/UserModel.js");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a User
  const User = new User({
    user_id: req.body.email,
    first_name: req.body.name,
    last_name: req.body.active,
    admin: req.body.admin,
    password: req.body.password,
  });

  // Save User in the database
  User.create(User, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    else res.send(data);
  });
};

// Find a single User with a UserId
exports.findOne = (req, res) => {
  User.findById(req.params.UserId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.UserId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.UserId
        });
      }
    } else res.send(data);
  });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  User.updateById(
    req.params.UserId,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.UserId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id " + req.params.UserId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {
  User.remove(req.params.UserId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.UserId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.params.UserId
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Users."
      });
    else res.send({ message: `All Users were deleted successfully!` });
  });
};