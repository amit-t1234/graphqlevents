const User = require('../../../models').User;
const TokenStore = require('../../../models').TokenStore;


module.exports = {

    async logout (_, args, {req}) {
        try {

            if (!req.isAuth) {
                throw new Error('Unauthorized');
            }

            const user = req.user;

            // delete all the tokens of this user from db
            const deleteToken = await TokenStore.destroy({ 
                where: {
                    userId: user.id,
                    token: req.headers['authorization'].split(' ')[1],
                }
             });

            return "Successfully logged out!"

        } catch (error) {
            throw new Error(error.message );
        }
    }
};