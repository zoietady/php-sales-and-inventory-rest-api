const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* import user model */
// const Sales = require("../models/SalesModel.js");

/* in memory data storage */
let data = require("../data.js");
let report = data.report;

// [authMiddleware.authenticateTokenCookie]
/* get all sales*/
router.get('/',[authMiddleware.authenticateTokenCookie],(req, res)=>{
    res.json(report);
});


module.exports = router;
