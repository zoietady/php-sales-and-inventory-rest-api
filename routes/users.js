const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
let data = require("../data.js");
let users = data.users;

/* get all user (admin restricted) */
router.get('/', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken],(req, res)=>{
    res.json(users);
});

/* get a user, get self is user restricted, get other user is admin restricted */
router.get('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateSelfRequest], (req, res)=>{
    /* get user of particular ID */
    let user = users.find( user => user.user_id === parseInt(req.params.id));

    /* if null return 404 */
    if (user == null) {
        return res.status(404).json({ message: 'Cannot find user' })
    }

    /* otherwise return 200 */
    res.json(user).status(200);
});

/* update user is self or admin restricted */
router.patch('/:id', (req, res)=>{
    
});

/* delete a user (admin restricted) */
router.delete('/:id',[authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken],(req, res)=>{

    /* check if user exists */
    /* if user is found delete*/
    if (users.filter(user => sale.user_id == parseInt(req.params.id))) {
        users = uerse.filter((user => user.user_id !== parseInt(req.params.id)));
        return res.json({message:"user deleted"}).status(200); 
    }

    /* otherwise send 404*/
    return res.status(404).json({ message: 'Cannot find user' });

});


module.exports = router;