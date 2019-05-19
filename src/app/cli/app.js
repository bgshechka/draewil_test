module.exports = ({ runner, baseLogger, database }) => ({
  start: (args) => {
    const logger = baseLogger.child({ namespace: 'cli' });
    Promise.resolve()
      .then(database.connect)
      .then(() => {
        runner.parse(args);
      })
      .catch((e) => {
        logger.error('CLI App Error ', e);
      });
  },
});
