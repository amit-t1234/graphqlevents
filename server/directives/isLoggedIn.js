const User = require('../models').User;
const TokenStore = require('../models').TokenStore;
const { jwtConfig } = require('../config/main-config');
const { verify } = require('jsonwebtoken');

const isBearer = (header) => {
    if (header) {
        let authorization = header.split(' ');
        if (authorization[0] === 'Bearer') {
            return authorization[1];
        }
    }

    return false;
}

module.exports = {
    async isLoggedIn (req, res, next) {
        
        try {
            
            // * Get the user from the token
            const bearer = isBearer(req.headers['authorization']);

            if (!bearer) {
                return next();
            }
            
            const jwt = verify(bearer, jwtConfig.jwtSecret);
            
            // * Check if token is valid
            const verifyToken = await TokenStore.findOne({
                where: {
                    userId: jwt.user.id,
                    token: bearer
                }
            });

            if (!verifyToken) {
                return next();
            }


            // * Check if user is in db
            const findUser = await User.findByPk(jwt.user.id);

            if (!findUser) {
                return next();
            }

            // * Return
            req.isAuth = true;
            req.user = findUser;
            return next();
        } catch (err) {
            console.log(err);
            return next();
        }

    }
}