const db = {};

const logger = {
  console: {
    level: process.env.LOG_LEVEL_CONSOLE,
  },
};

module.exports = {
  db,
  logger,
  songsLibraryUrl: 'testLibUrl',
  port: process.env.PORT,
};
