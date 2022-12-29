const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { combineResolvers } = require('graphql-resolvers');

const User = require('../database/models/user');
const Task = require('../database/models/task');
const { isAuthenticated } = require('./middleware');

module.exports = {
	Query: {
		user: combineResolvers(isAuthenticated, async (_, __, { email }) => {
			try {
				const user = await User.findOne({ email });
				if (!user) {
					throw new Error('User not found');
				}
				return user;
			} catch (err) {
				console.error(err);
				throw err;
			}
		}),
	},
	Mutation: {
		signup: async (_, { input }) => {
			try {
				const user = await User.findOne({ email: input.email });
				if (user) {
					throw new Error('Email already in use');
				}
				const hashedPassword = await bcrypt.hash(input.password, 12);
				const newUser = new User({ ...input, password: hashedPassword });
				const result = await newUser.save();
				return result;
			} catch (err) {
				console.error(err);
				throw err;
			}
		},
		login: async (_, { input }) => {
			try {
				const user = await User.findOne({ email: input.email });
				if (!user) {
					throw new Error('User not found');
				}
				const isPasswordValid = await bcrypt.compare(
					input.password,
					user.password
				);
				if (!isPasswordValid) {
					throw new Error('Incorrect password');
				}
				const secret = process.env.JWT_SECRET_KEY || 'secret';
				const token = jwt.sign({ email: user.email }, secret, {
					expiresIn: '1d',
				});

				return { token };
			} catch (err) {
				console.error(err);
				throw err;
			}
		},
	},

	User: {
		tasks: async ({ id }) => {
			try {
				const task = await Task.find({ user: id });
				return task;
			} catch (err) {
				console.error(err);
				throw err;
			}
		},
	},
};
