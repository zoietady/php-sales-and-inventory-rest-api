const express = require('express');
const router = express.Router();

/* import admin dependencies */
const bcrypt = require('bcrypt');

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* import user model */
const User = require("../models/UserModel.js");

/* in memory data storage */
let data = require("../data.js");
let users = data.users.filter( user => user.admin === true);

//get all admin
router.get('/', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken],(req, res)=>{
    User.findByRole(1, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No admin found.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving admin"
                });
            }
        } else res.send(data);
    });
})

//get one specific admin
router.get('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], (req, res)=>{
    User.findAdminById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found admin with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving admin with id " + req.params.id
                });
            }
        } else res.send(data);
    });
})

//edit one admin
router.patch('/:id', (req, res)=>{
    
})

//delete one admin
router.delete('/:id', (req, res)=>{

})

module.exports = router;