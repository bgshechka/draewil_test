const mongoose = require('mongoose');

module.exports = ({ config, baseLogger }) => ({
  mongoose,
  connect: () => {
    const logger = baseLogger.child({ namespace: 'mongoose' });
    const {
      db: {
        uri,
        dbName,
        user,
        pass,
        reconnectTries,
        reconnectInterval,
        retryTimeout,
        debug,
      },
    } = config;

    mongoose.set('debug', debug);

    const options = {
      dbName,
      user,
      pass,
      useNewUrlParser: true,
      // autoIndex: false,
      reconnectTries,
      reconnectInterval,
      bufferMaxEntries: 0,
      useCreateIndex: true,
    };

    const connectWithRetry = () => mongoose.connect(uri, options)
      .then((result) => {
        logger.info('MongoDB is connected');
        return result;
      })
      .catch((error) => {
        logger.error(error);
        logger.error(`MongoDB connection unsuccessful, retry after ${retryTimeout / 1000} seconds.`);
        setTimeout(connectWithRetry, retryTimeout);
      });

    return connectWithRetry();
  },
});
