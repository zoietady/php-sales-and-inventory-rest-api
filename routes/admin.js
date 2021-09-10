const express = require('express');
const router = express.Router();

/* import admin dependencies */
const bcrypt = require('bcrypt');

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
let data = require("../data.js");
let users = data.users.filter( user => user.admin === true);

//get all admin
router.get('/', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken],(req, res)=>{
    res.json(users).status(200);
})

//get one specific admin
router.get('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], (req, res)=>{
    let admin = users.find( user => user.user_id === req.params.id);
    res.json(admin).status(200);
})

//edit one admin
router.patch('/:id', (req, res)=>{
    
})

//delete one admin
router.delete('/:id', (req, res)=>{

})

module.exports = router;