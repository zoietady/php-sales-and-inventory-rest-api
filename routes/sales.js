const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
const data = require("../data.js");
const sales = data.sales;

/* get all sales*/
router.get('/', [authMiddleware.authenticateToken],(req, res)=>{
    res.send(sales);
});

module.exports = router;
