const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
let data = require("../data.js");
let inventory = data.inventory;

/* add inventory record */
router.post('/', [authMiddleware.authenticateTokenCookie] ,async (req, res)=>{
    try{
        /* parse sales details */
        const inventory_record = { 
            product_id: req.body.product_id,
            product_name: req.body.product_name,
            product_group: req.body.product_group,
            max_stock_capacity: req.body.max_stock_capacity,
            current_stock: req.body.current_stock,
            product_description: req.body.product_description,
            product_price: req.body.product_price
        };
        
        console.log("new user registered");
        console.log(inventory_record);

        /* store sales record */
        inventory.push(inventory_record);

        /* send status */
        return res.status(201).send("success");

    } catch{
        /* send 500 for failed process */
        return res.status(500).send("error in adding record");
    };
});

/* get all inventory*/
router.get('/', [authMiddleware.authenticateTokenCookie],(req, res)=>{
    res.json(inventory).status(200);
});

/* update a inventory record (user restricted) */
router.get('/:id',[authMiddleware.authenticateTokenCookie], (req, res)=>{
    /* get inventory details of said product*/
    let inventory_record = inventory.find( product => product.product_id === parseInt(req.params.id));

    /* if null return 404 */
    if (inventory_record == null) {
        return res.status(404).json({ message: 'Cannot find inventory details' })
    }

    /* else return 200 */
    res.json(inventory_record).status(200);
});

/* delete a inventory record */
router.delete('/:id', [authMiddleware.authenticateTokenCookie],(req, res)=>{
    /* check if inventory record exists */
    /* if inevntory record is found delete*/
    if (inventory.filter(product => product.product_id == parseInt(req.params.id))) {
        product = product.filter((product => product.product_id !== parseInt(req.params.id)));
        return res.json({message:"item deleted"}).status(200); 
    }

    /* otherwise send 404*/
    return res.status(404).json({ message: 'Cannot find inventory record' });

});

module.exports = router;