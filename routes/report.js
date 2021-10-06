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

router.get('/summary',[authMiddleware.authenticateTokenCookie],(req, res)=>{
    res.json({"summary": "This is a sample summary report of roughly the same length: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse "});
});



module.exports = router;
