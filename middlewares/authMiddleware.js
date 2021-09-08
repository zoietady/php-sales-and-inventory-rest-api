const jwt = require('jsonwebtoken');
module.exports = {
    generateAccessToken: function (user) {
        /* sign access token */
        
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
    },
    generateRefreshToken: function (user) {
        /* sign refresh token */
        return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    },
    authenticateToken: function(req, res, next) {
        /* collcet auth header*/
        const authHeader = req.headers['authorization']

        /* collect token from header */
        const token = authHeader && authHeader.split(' ')[1];

        /* send 401 when token is null */
        if (token == null) return res.sendStatus(401);
      
        /* decrypt and verify token */
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            /* log error if any*/
            if (err) console.log(err);

            /* decrypt and verify token */
            if (err) return res.sendStatus(403);

            /*set payload as user on request objcet*/
            req.user = payload;
            next();
        })
      },
    authenticateTokenCookie: function(req, res, next) {
        /* collect token from cookie*/
        const token = req.cookies.access_token;

        /* send 401 when token is null */
        if (token == null) return res.sendStatus(403);
      
        /* decrypt and verify token */
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            /* log error if any*/
            if (err) console.log(err);

            /* decrypt and verify token */
            if (err) return res.sendStatus(403);

            /*set payload as user on request objcet*/
            req.user = payload;
            next();
        })
      },
    authenticateAdminToken: function(req, res, next) {
      /* check if token sender is admin */
      if (req.user.admin !== true) res.sendStatus(401);
      next();
    }
};
