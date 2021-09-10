const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
let data = require("../data.js");
let inventory = data.inventory;

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

/* delete a user (admin restricted) */
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