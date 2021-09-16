const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* import user model */
const Product = require("../models/ProductModel.js");

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
        let product = {};

        for (const name in req.body){
            product[name] = req.body[name];
        }

        Product.create(product,(err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found product with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating product with id " + req.params.id
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
    Product.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving products."
          });
        else res.send(data);
    });
});

/* update a sales record (user restricted) */
router.get('/:id', [authMiddleware.authenticateTokenCookie], (req, res)=>{
    Product.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found product with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving product with id " + req.params.id
                });
            }
        } else res.send(data);
    });
});

/* delete a sales record (admin restricted) */
router.delete('/:id', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], (req, res)=>{
   
    Product.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found product with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete product with id " + req.params.id
            });
          }
        } else res.send({ message: `product was deleted successfully!` });
    });
});

/* update user is self or admin restricted */
router.patch('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], async (req, res)=>{
    
    /* check for body content */
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!"});
    }

    try{
        let product = {};

        for (const name in req.body){
            product[name] = req.body[name];
        }

        Product.updateById(req.params.id,product,(err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found product with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating product with id " + req.params.id
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
