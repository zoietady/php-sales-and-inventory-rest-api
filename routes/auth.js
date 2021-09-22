/* instantiate router */
const express = require('express');
const router = express.Router();

/* import admin dependencies */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* import custom middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* import user model */
const User = require("../models/UserModel.js");

const connection = require("../models/db.js");

/* in memory data storage */
let data = require("../data.js");

/* temporary users container */
let users = data.users;

/* temporary refresh tokens container */
let refreshTokens = data.refershTokens;

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
router.post('/register', [authMiddleware.authenticateTokenCookie, authMiddleware.authenticateAdminToken] ,async (req, res)=>{

    /* check for body content */
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!"});
    }

    /* check for body content */
    if (!req.body.first_name) {
        return res.status(400).send({ message: "missing value"});
    }

    if (req.body.admin === null) {
        return res.status(400).send({ message: "missing value"});
    }

    if (!req.body.password) {
        return res.status(400).send({ message: "missing value"});
    }

    try{
        let user = {};

        for (const name in req.body){
            user[name] = req.body[name];
        }

        if (user.hasOwnProperty("password")){
            /* generate encryption salt */
            const salt = await bcrypt.genSalt();

            /* hash password */
            user["password"] = await bcrypt.hash(req.body.password, salt);  
        }

        /* save user to database */
        User.create(user, (err, data) => {
            /* check for errors */
            if (err) return res.status(500).send({ message: err.message || "Internal server error"});

            /*if good, send 200 with user */
            else return res.status(200).send(data);
        });

    } catch{
        /* send 500 for failed process */
        return res.status(500).send("error in registration");
    };
    
});

/* login user */
router.post('/login',async (req, res) => {
    let queryString = 'SELECT * FROM authenticationtable WHERE user_id = ?';
    const queryResult = await new Promise(resolve => connection.query(queryString, req.body.user_id, (error, result) => resolve(result)));
    console.log(queryResult);

    let user = queryResult[0];

    console.log(user);
    
    /* if user is not registered return 400 */
    if (user == null) {
        return res.status(404).send('cannot find user')
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
            res.cookie("access_token", accessToken,{httpOnly: true, SameSite="None"})
                .cookie("refresh_token", refreshToken, {httpOnly: true, SameSite="None"})
                .json({ user_id: user.user_id,admin: user.admin, expires_in: "15min" })
                .status(200);

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
router.delete('/logout', authMiddleware.authenticateTokenCookie,(req, res) => {
    /* delete refresh token*/
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.clearCookie("access_token").clearCookie("refresh_token").json({ message: "logged out" }).status(200);
});


/* refresh access token user */
router.post('/token', (req,res) => {
    /* collect access token */
    const refreshToken = req.cookies.refresh_token;
    
    /* check if token was retrieved */
    if (refreshToken == null) return res.sendStatus(401);

    /* check if refresh token is valid */
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    /* verify token */
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        /* if verification fails */
        if (err) return res.sendStatus(403);

        const userSigniture = { user_id: user.user_id, admin: user.admin };

        /* verify token */
        const accessToken = authMiddleware.generateAccessToken(userSigniture);

        /* send new token */
        /* send json response containing token */
        res.cookie("access_token", accessToken,{httpOnly: true})
        .cookie("refresh_token", refreshToken, {httpOnly: true})
        .json({ user_id: user.user_id,admin: user.admin, expires_in: "15min" })
        .status(200);
    });
});



module.exports = router;