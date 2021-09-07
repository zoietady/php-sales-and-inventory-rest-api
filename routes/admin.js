const express = require('express');
const router = express.Router();

/* import admin dependencies */
const bcrypt = require('bcrypt');

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
const data = require("../data.js");

const users = data.users.filter( user => user.admin === true);

//get all admin
router.get('/', [authMiddleware.authenticateToken, authMiddleware.authenticateAdminToken],(req, res)=>{
    res.json(users);
})

//get one admin
router.get('/:id', (req, res)=>{
    res.send('route to single admin');
})

//edit one admin
router.patch('/:id', (req, res)=>{
    
})

//delete one admin
router.delete('/:id', (req, res)=>{

})

module.exports = router;