const User = require('../../../models').User;
const TokenStore = require('../../../models').TokenStore;
const { jwtConfig } = require('../../../config/main-config');
const { sign } = require('jsonwebtoken');

const generateToken = (user) => {
    // Return Json Token for login
    return sign({user}, jwtConfig.jwtSecret, {
        expiresIn: jwtConfig.jwtLifeTime
    });
}


module.exports = {
    async login (_, args, {req}) {
        try {
            const { username, password } = args.user;
            const user = await User.findOne({
                where: {
                    username
                }
            });
            
            // User doesn't exists or password is invalid
            if (!user) {
                throw new Error('Invalid Username or Password');
            }

            const checkPassword = await user.validatePassword(password);
            if (!checkPassword) {
                throw new Error('Invalid Username or Password');
            }

            const token = generateToken(user);

            // Store the token
            const createToken = await TokenStore.create({ token, userId: user.id });

            return  { token };

        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong!');
        }
    },
};