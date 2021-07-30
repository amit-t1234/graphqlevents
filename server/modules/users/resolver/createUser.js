const User = require('../../../models').User;
const TokenStore = require('../../../models').TokenStore;


module.exports = {
    async createUser (_, args, {req}) {
        try {
            const { username, password } = args.user;
            const user = await User.create({username, password});

            return user
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong!');
        }
    },
};