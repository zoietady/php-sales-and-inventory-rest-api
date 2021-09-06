const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* get all user (admin restricted) */
router.get('/', [authMiddleware.authenticateToken, authMiddleware.authenticateAdminToken],(req, res)=>{
    res.send('all users route');
});

/* get a user (user restricted) */
router.get('/:id', (req, res)=>{
    res.send('all users route');
});

/* update this user (user restricted) */
router.patch('/:id', (req, res)=>{
    
});

/* update a user (user restricted) */
router.patch('/:id', (req, res)=>{
    
});

/* delete a user (admin restricted) */
router.delete('/:id', (req, res)=>{

});

module.exports = router;