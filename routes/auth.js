/* instantiate router */
const express = require('express');
const router = express.Router();

/* import admin dependencies */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* import custom middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* in memory data storage */
const data = require("../data.js");

/* temporary users container */
const users = data.users;

/* temporary refresh tokens container */
const refreshTokens = data.refershTokens;

/* register a new user */
/* req contains user credentials
    *follows Google JSON variable format (camel cased)
    *firstName, lastName, username, and role fields are case sensitive
    *password field is case sensitive, accepts numbers, and special characters: ~`!@#$%^&*()_-+={[}]|\:;"'<,>.?/
    *role can be either admin or user

    example:
    {
        "firstName" : "Mike",
        "lastName" : "Wazowski",
        "username" : "BigMike",
        "admin" : true,
        "password" : "testP"
    }
*/
router.post('/register', [authMiddleware.authenticateToken, authMiddleware.authenticateAdminToken] ,async (req, res)=>{
    try{
        /* generate encryption salt */
        const salt = await bcrypt.genSalt();

        /* hash password */
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        /* parse user details */
        const user = { 
            user_id: req.body.user_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            admin: req.body.admin,
            password: hashedPassword
        };
        
        console.log("new user registered");
        console.log(user);

        /* store user */
        users.push(user);

        /* send status */
        res.status(201).send("success");

    } catch{
        /* send 500 for failed process */
        res.status(500).send("error in registration");
    };
});

/* login user */
router.post('/login', async (req, res) => {
    /* look for user in database */
    const user = users.find(user => user.user_id === req.body.user_id);
    
    

    /* if user is not registered return 400 */
    if (user == null) {
        return res.status(400).send('cannot find user')
    }

    /* if found try decrypting password */
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            /* if user is found return JWT */
            /* construct sign basis */
            const userSigniture = { user_id: user.user_id, admin: user.admin };
            
            /* sign access token */
            const accessToken = authMiddleware.generateAccessToken(userSigniture);
            
            /* sign refresh token */
            const refreshToken = authMiddleware.generateRefreshToken(userSigniture);

            /* add to token container */
            refreshTokens.push(refreshToken);

            /* send json response containing token */
            res.json({ accessToken: accessToken, refreshToken: refreshToken, admin: user.admin, expires_in: "15min" });

        } else {

            /* else send 403 */
            res.status(403).send();
        }
    } catch {
        /* if process fails return 500 */
        res.status(500).send();
    }
});

/* logout user */
router.delete('/logout', (req, res) => {
    /* delete refres*/
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});


/* refresh access token user */
router.post('/token', (req,res) => {
    /* collect access token */
    const refreshToken = req.body.token;
    
    /* check if token was retrieved */
    if (refreshToken == null) return res.sendStatus(401);

    /* check if refresh token is valid */
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    /* verify token */
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        /* if verification fails */
        if (err) return res.sendStatus(403);

        /* verify token */
        const accessToken = authMiddleware.generateAccessToken({ user_id: user.user_id });

        /* send new token */
        res.json({ accessToken: accessToken })
    });
});



module.exports = router;