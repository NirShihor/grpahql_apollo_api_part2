const mongoose = require('mongoose');

module.exports = async () => {
	mongoose.set('strictQuery', false);
	try {
		await mongoose.connect(process.env.MONGO_DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Database connected successfully');
	} catch (err) {
		console.error(err);
		throw err;
	}
};

module.exports.isValidObjectId = (id) => {
	return mongoose.Types.ObjectId.isValid(id);
};
