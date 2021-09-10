const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
let data = require("../data.js");
let sales = data.sales;

/* get all sales*/
router.get('/', [authMiddleware.authenticateTokenCookie],(req, res)=>{
    res.json(sales).status(200);
});

/* update a sales record (user restricted) */
router.get('/:id', [authMiddleware.authenticateTokenCookie], (req, res)=>{
    /* get sales record of particular ID */
    let sales_record = sales.find( sale => sale.sales_id === parseInt(req.params.id));

    /* if null return 404 */
    if (sales_record == null) {
        return res.status(404).json({ message: 'Cannot find sales record' });
    }

    /* otherwise return 200 */
    res.json(sales_record).status(200);
});

/* delete a sales record (admin restricted) */
router.delete('/:id', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], (req, res)=>{
   
    /* check if sales record exists */
    /* if sales record is found delete*/
    if (sales.filter(sale => sale.sales_id == parseInt(req.params.id))) {
        sales = sales.filter((sale => sale.sales_id !== parseInt(req.params.id)));
        return res.json({message:"item deleted"}).status(200); 
    }

    /* otherwise send 404*/
    return res.status(404).json({ message: 'Cannot find sales record' });
    
});

module.exports = router;
