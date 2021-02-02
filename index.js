// Dependencies
const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

// Relative imports
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config');

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;
// This is for actual deployment server ->*

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req, pubsub }),
	// Forward request body to the context
	// It enables to access the req body in the context
});

mongoose
	.connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
	//Without 'useUnifiedTopology: true,' will cause => DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version.
	.then(() => {
		console.log('MongoDB Connected');
		return server.listen({ port: PORT });
		// return server.listen({ port: 5000 });
		// * -> this is for localhost:5000
	})
	.then((res) => {
		console.log(`server running at ${res.url}`);
	})
	.catch((err) => {
		console.error(err);
	});

// Apollo server actually runs Express at the back, can be seen in the node_module which included after install apollo-server
