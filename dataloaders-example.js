const DataLoader = require('dataloader');

const batchUsers = async (ids) => {
	console.log('BATCH USERS: ', ids);
	return ids;
};

const batchUserLoader = new DataLoader((keys) => batchUsers(keys));

batchUserLoader.load(1);
batchUserLoader.load(2);
batchUserLoader.load(3);

// Force next-tick
setTimeout(() => {
	batchUserLoader.load(4);
	batchUserLoader.load(5);
	batchUserLoader.load(6);
}, 100);

// force next-tick
setTimeout(() => {
	batchUserLoader.load(7);
	batchUserLoader.load(8);
	batchUserLoader.load(9);
}, 200);
