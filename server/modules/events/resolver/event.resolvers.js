const { createEvent, getEvents, inviteEvent } = require('./event');

const resolvers = {
  Query: {
    getEvents
  },
  Mutation: {
    createEvent,
    inviteEvent,
  },
}

module.exports = {
  resolvers
}