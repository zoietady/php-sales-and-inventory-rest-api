const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
const data = require("../data.js");
const sales = data.sales;

/* get all sales*/
router.get('/', [authMiddleware.authenticateTokenCookie],(req, res)=>{
    res.json(sales).status(200);
});

/* update a sales record (user restricted) */
router.get('/:id', (req, res)=>{
    let sales_record = sales.find( sale => sale.sales_id === parseInt(req.params.id));
    if (sales_record == null) {
        return res.status(404).json({ message: 'Cannot find subscriber' })
    }
    res.json(sales_record).status(200);
});

/* delete a user (admin restricted) */
router.delete('/:id', (req, res)=>{

});

module.exports = router;
