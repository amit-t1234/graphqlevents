const User = require('../../../models').User;
const TokenStore = require('../../../models').TokenStore;
// const { jwtConfig } = require('../config/main-config');
// const { sign } = require('jsonwebtoken');

// const generateToken = (user) => {
//     // Return Json Token for login
//     return sign({user}, jwtConfig.jwtSecret, {
//         expiresIn: jwtConfig.jwtLifeTime
//     });
// }


module.exports = {
    async getUser (_, args, {req}) {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthorized');
            }

            const user = await User.findByPk(req.user.id);

            return user
        } catch (error) {
            console.log(error);
            throw new Error('Unauthorized');
        }
    },
};