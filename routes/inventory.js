const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
const data = require("../data.js");
const inventory = data.inventory;

/* get all sales*/
router.get('/', [authMiddleware.authenticateToken],(req, res)=>{
    res.send(inventory);
});

module.exports = router;