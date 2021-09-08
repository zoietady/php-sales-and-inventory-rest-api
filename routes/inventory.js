const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
const data = require("../data.js");
const inventory = data.inventory;

/* get all inventory*/
router.get('/', [authMiddleware.authenticateTokenCookie],(req, res)=>{
    res.json(inventory).status(200);
});

/* update a inventory record (user restricted) */
router.get('/:id', (req, res)=>{
    let inventory_record = inventory.find( product => product.product_id === parseInt(req.params.id));
    if (inventory_record == null) {
        return res.status(404).json({ message: 'Cannot find subscriber' })
    }
    res.json(inventory_record).status(200);
});

/* delete a user (admin restricted) */
router.delete('/:id', (req, res)=>{

});

module.exports = router;