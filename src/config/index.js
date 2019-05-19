const dotenv = require('dotenv');

dotenv.config();

if (!['production', 'development', 'test'].includes(process.env.NODE_ENV)) {
  throw new Error('You should specify environment (NODE_ENV): \'production\', \'development\' or \'test\'');
}

// eslint-disable-next-line import/no-dynamic-require
const config = require(`./${process.env.NODE_ENV}`);

module.exports = config;
