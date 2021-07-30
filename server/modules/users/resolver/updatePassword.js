const User = require('../../../models').User;
const TokenStore = require('../../../models').TokenStore;

module.exports = {
    async updatePassword (_, args, {req}) {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthorized');
            }

            const { old_password, new_password } = args;
            const user = req.user;

            const checkPassword = await user.validatePassword(old_password);
            if (!checkPassword) {
                throw new Error('Password did not match');
            }

            // delete all the tokens of this user from db
            const deleteToken = await TokenStore.destroy({ 
                where: {
                    userId: user.id,
                }
             });


            // Update Password
            let update = await user.update({ password: new_password });
            
            return update

        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong!');
        }
    },
};