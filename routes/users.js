const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
const data = require("../data.js");
const users = data.users;

/* get all user (admin restricted) */
router.get('/', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken],(req, res)=>{
    res.json(users);
});

/* get a user, get self is user restricted, get other user is admin restricted */
router.get('/:id', (req, res)=>{
    let user = users.find( user => user.user_id === parseInt(req.params.id));
    if (user == null) {
        return res.status(404).json({ message: 'Cannot find subscriber' })
    }
    res.json(user).status(200);
});

/* update user is self or admin restricted */
router.patch('/:id', (req, res)=>{
    
});

/* delete a user (admin restricted) */
router.delete('/:id', (req, res)=>{

});


module.exports = router;