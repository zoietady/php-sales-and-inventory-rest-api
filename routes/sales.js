const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
let data = require("../data.js");
let sales = data.sales;

router.post('/', [authMiddleware.authenticateTokenCookie] ,async (req, res)=>{
    try{
        /* parse sales details */
        const sale = { 
            sales_id: req.body.sales_id,
            date_time: req.body.date_time,
            product_id: req.body.product_id,
            product_name: req.body.product_name,
            product_group: req.body.product_group,
            quantity_sold: req.body.quantity_sold,
            product_sales_value: req.body.product_sales_value
        };
        
        console.log("new user registered");
        console.log(sale);

        /* store sales record */
        sales.push(sale);

        /* send status */
        return res.status(201).send("success");

    } catch{
        /* send 500 for failed process */
        return res.status(500).send("error in adding record");
    };
});

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
