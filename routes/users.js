const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");
const bcrypt = require('bcrypt');

/* import user model */
const User = require("../models/UserModel.js");

/* in memory data storage */
let data = require("../data.js");
let users = data.users;

/* get all user (admin restricted) */
router.get('/', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken],(req, res)=>{
    User.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Users."
          });
        else res.send(data);
    });
});

/* get a user, get self is user restricted, get other user is admin restricted */
router.get('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateSelfRequest], (req, res)=>{
    User.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving User with id " + req.params.id
                });
            }
        } else res.send(data);
    });
});

/* update user is self or admin restricted */
router.patch('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateSelfRequest], async (req, res)=>{
    
    /* check for body content */
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!"});
    }

    try{

        let user = {};

        for (const name in req.body){
            user[name] = req.body[name];
        }

        if (user.hasOwnProperty("password")){
            /* generate encryption salt */
            const salt = await bcrypt.genSalt();

            /* hash password */
            user["password"] = await bcrypt.hash(req.body.password, salt);  
        }
        

        User.updateById(req.params.id,user,(err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found User with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating User with id " + req.params.id
                        });
                    }
                } else res.send(data);
            }
        );
    } catch{
        /* send 500 for failed process */
        return res.status(500).send("error in registration");
    };
});

/* delete a user (admin restricted) */
router.delete('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken],(req, res)=>{

    User.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete User with id " + req.params.id
            });
          }
        } else res.send({ message: `User was deleted successfully!` });
    });

});


module.exports = router;