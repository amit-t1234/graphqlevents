const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./server/modules');
const { isLoggedIn } = require('./server/directives/isLoggedIn');

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(isLoggedIn);

// Require our routes into the application.
// require('./server/routes')(app);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

async function startServer() {
  await apolloServer.start();

  apolloServer.applyMiddleware({app, isLoggedIn});

  app.get('*', (req, res) => res.status(200).send({
    message: 'MU also stands for nothingness.',
  }));

  const port = parseInt(process.env.PORT, 10) || 8000;
  app.set('port', port);

  app.listen(port, () => {
      console.log(`🚀 SERVER UP AND RUNNING AT: 127.0.0.1:${port}`);
  });

}

startServer();
module.exports = app;