const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* import user model */
const Supplier = require("../models/SupplierModel.js");

/* in memory data storage */
let data = require("../data.js");

router.post('/', [authMiddleware.authenticateTokenCookie] ,async (req, res)=>{
    /* check for body content */
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!"});
    }

    try{
        /* parse user details */
        const supplier = { 
            supplier_id: req.body.supplier_id,
            supplier_name: req.body.supplier_name
        };

        Supplier.create(new Supplier(supplier),(err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found Supplier with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Supplier with id " + req.params.id
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

/* get all Supplier*/
router.get('/', [authMiddleware.authenticateTokenCookie],(req, res)=>{
    Supplier.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Suppliers."
          });
        else res.send(data);
    });
});

/* update a Supplier record (user restricted) */
router.get('/:id', [authMiddleware.authenticateTokenCookie], (req, res)=>{
    Supplier.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Supplier with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Supplier with id " + req.params.id
                });
            }
        } else res.send(data);
    });
});

/* delete a Supplier record (admin restricted) */
router.delete('/:id', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], (req, res)=>{
   
    Supplier.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Supplier with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Supplier with id " + req.params.id
            });
          }
        } else res.send({ message: `Supplier was deleted successfully!` });
    });
});

/* update user is self or admin restricted */
router.patch('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateSelfRequest], async (req, res)=>{
    
    /* check for body content */
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!"});
    }

    try{
        let supplier = {};

        for (const name in req.body){
            supplier[name] = req.body[name];
        }

        Supplier.updateById(req.params.id,supplier,(err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found Supplier with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Supplier with id " + req.params.id
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
