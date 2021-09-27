const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* import user model */
const Delivery = require("../models/DeliveryModel.js");

/* in memory data storage */
let data = require("../data.js");
let sales = data.sales;

router.post('/', [authMiddleware.authenticateTokenCookie] ,async (req, res)=>{
    /* check for body content */
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!"});
    }

    try{
        /* parse user details */
        let delivery = {};

        for (const name in req.body){
            delivery[name] = req.body[name];
        }

        Delivery.create(delivery,(err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found Delivery with id .`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Delivery with id "
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

/* get all sales*/
router.get('/', [authMiddleware.authenticateTokenCookie],(req, res)=>{
    Delivery.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Deliverys."
          });
        else res.send(data);
    });
});

/* update a sales record (user restricted) */
router.get('/:id', [authMiddleware.authenticateTokenCookie], (req, res)=>{
    Delivery.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Delivery with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Delivery with id " + req.params.id
                });
            }
        } else res.send(data);
    });
});

/* delete a sales record (admin restricted) */
router.delete('/:id', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], (req, res)=>{
   
    Delivery.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Delivery with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Delivery with id " + req.params.id
            });
          }
        } else res.send({ message: `Delivery was deleted successfully!` });
    });
});

/* update user is self or admin restricted */
router.patch('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], async (req, res)=>{
    
    /* check for body content */
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!"});
    }

    try{
        let delivery = {};

        for (const name in req.body){
            delivery[name] = req.body[name];
        }

        Delivery.updateById(req.params.id,delivery,(err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found Delivery with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Delivery with id " + req.params.id
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
