const { createUser } = require('./createUser');
const { getUser } = require('./getUser');
const { login } = require('./login');
const { updatePassword } = require('./updatePassword');
const { logout } = require('./logout');

const resolvers = {
  Query: {
    getUser,
    logout,
  },
  Mutation: {
    createUser,
    login,
    updatePassword,
  },
}

module.exports = {
  resolvers
}