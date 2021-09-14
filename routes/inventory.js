const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
let data = require("../data.js");
let inventory = data.inventory;

/* import user model */
const Inventory = require("../models/InventoryModel.js");

router.post('/', [authMiddleware.authenticateTokenCookie] ,async (req, res)=>{
    Inventory.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Inventorys."
          });
        else res.send(data);
    });
});

/* get all sales*/
router.get('/', [authMiddleware.authenticateTokenCookie],(req, res)=>{
    Inventory.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Inventorys."
          });
        else res.send(data);
    });
});

/* update a sales record (user restricted) */
router.get('/:id', [authMiddleware.authenticateTokenCookie], (req, res)=>{
    Inventory.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Inventory with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Inventory with id " + req.params.id
                });
            }
        } else res.send(data);
    });
});

/* delete a sales record (admin restricted) */
router.delete('/:id', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], (req, res)=>{
   
    Inventory.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Inventory with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Inventory with id " + req.params.id
            });
          }
        } else res.send({ message: `Inventory was deleted successfully!` });
    });
});

/* update user is self or admin restricted */
router.patch('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], async (req, res)=>{
    
    /* check for body content */
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!"});
    }

    try{
        /* parse user details */
        const Inventory = { 
            update_index: req.body.update_index,
            product_id: req.body.product_id,
            current_stock: req.body.current_stock,
            max_stock_capacity: req.body.max_stock_capacity,
            date_time: req.body.date_time
        };

        Inventory.updateById(req.params.id,new Inventory(Inventory),(err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found Inventory with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Inventory with id " + req.params.id
                        });
                    }
                } else res.send(data);
            }
        );
    } catch{
        /* send 500 for failed process */
        return res.status(500).send("error in registration");
    };
});

module.exports = router;