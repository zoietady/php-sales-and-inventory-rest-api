const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* import user model */
const Sales = require("../models/SalesModel.js");

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
        let sale = {};

        for (const name in req.body){
            sale[name] = req.body[name];
        }

        Sales.create(sale,(err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found Sales with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Sales with id " + req.params.id
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

router.post('/many', [authMiddleware.authenticateTokenCookie] ,async (req, res)=>{
    /* check for body content */
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!"});
    }

    try{
        /* parse user details */
        let salesList = [];
        let sale;

        for (var i in req.body){
            sale = [];
            for (const name in req.body[i]){
                sale.push(req.body[i][name]);
            }
            salesList.push(sale);
        }

        console.log(salesList);
        
        Sales.createMany(salesList,(err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found Sales with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Sales with id " + req.params.id
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

// [authMiddleware.authenticateTokenCookie]
/* get all sales*/
router.get('/',[authMiddleware.authenticateTokenCookie],(req, res)=>{
    Sales.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Saless."
          });
        else res.send(data);
    });
});

/* update a sales record (user restricted) */
router.get('/:id', [authMiddleware.authenticateTokenCookie], (req, res)=>{
    Sales.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Sales with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Sales with id " + req.params.id
                });
            }
        } else res.send(data);
    });
});

/* delete a sales record (admin restricted) */
router.delete('/:id', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], (req, res)=>{
   
    Sales.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Sales with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Sales with id " + req.params.id
            });
          }
        } else res.send({ message: `Sales was deleted successfully!` });
    });
});

/* update user is self or admin restricted */
router.patch('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken], async (req, res)=>{
    
    /* check for body content */
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!"});
    }

    try{
        let sale = {};

        for (const name in req.body){
            sale[name] = req.body[name];
        }

        Sales.updateById(req.params.id,sale,(err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found Sales with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Sales with id " + req.params.id
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
