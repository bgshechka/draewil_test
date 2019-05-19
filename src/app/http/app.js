let isStarted = false;
module.exports = ({ server, baseLogger, database }) => {
  const logger = baseLogger.child({ namespace: 'app:http' });
  return {
    get isStarted() {
      return isStarted;
    },
    start: async () => Promise
      .resolve()
      .then(() => database.connect())
      .then(() => logger.debug('Starting server'))
      .then(() => server.start())
      .then(() => {
        isStarted = true;
        logger.info('App started');
      })
      .catch((e) => {
        logger.error('App Error: Something very bad has happened', { error: e });
        process.exit(1);
      }),

    stop: async () => Promise
      .resolve()
      .then(() => server.stop())
      .then(() => logger.debug('Server closed'))
      .then(() => {
        isStarted = false;
        logger.info('App stopped');
      })
      .catch((e) => {
        logger.error('App Error: Something very bad has happened', { error: e });
        process.exit(1);
      }),
  };
};
