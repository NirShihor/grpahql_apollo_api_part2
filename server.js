const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotenv = require('dotenv');
const DataLoader = require('dataloader');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const connection = require('./database/util');
const { verifyUser } = require('./helper/context/index');
const loaders = require('./loaders');

// set env variables
dotenv.config();

const app = express();

// const httpServer = createServer(app);

// connect to database
connection();

// cors middleware
app.use(cors());

// body parest middleware
app.use(express.json());

// apollo server

// for cashing user information - but NOT ADVISABLE!
// const userLoader = new DataLoader((keys) => loaders.user.batchUsers(keys));

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req, connection }) => {
		const contextObj = {};
		if (req) {
			await verifyUser(req);
			contextObj.email = req.email;
			contextObj.loggedInUserId = req.loggedInUserId;
		}
		contextObj.loaders = {
			user: new DataLoader((keys) => loaders.user.batchUsers(keys)),
		};
		return contextObj;
	},
	formatError(err) {
		console.log(err);
		return {
			message: err.message,
		};
	},
});

async function start() {
	await server.start();
	server.applyMiddleware({ app, path: '/graphql' });

	const PORT = process.env.PORT || 4000;

	app.use('/', (req, res) => {
		res.send('Hello there');
	});

	app.listen(PORT, () => {
		console.log(`Server started on port ${PORT}`);
		console.log(`Graphql server started on http://localhost:${PORT}/graphql`);
	});

	// const wsServer = new WebSocketServer({
	// 	server: httpServer,
	// 	path: '/graphql',
	// });

	// const serverCleanup = useServer(server, wsServer);
	// server.installSubscriptionHandlers(httpServer);
}

start();
