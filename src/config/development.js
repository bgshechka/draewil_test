const db = {
  uri: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  reconnectTries: process.env.DB_RECONNECT_TRIES,
  reconnectInterval: process.env.DB_RECONNECT_INTERVAL,
  retryTimeout: process.env.DB_RETRY_TIMEOUT,
};

const logger = {
  console: {
    level: process.env.LOG_LEVEL_CONSOLE,
  },
};

module.exports = {
  db,
  logger,
  songsLibraryUrl: process.env.SONGS_LIBRARY_URL,
  port: process.env.PORT,
};
