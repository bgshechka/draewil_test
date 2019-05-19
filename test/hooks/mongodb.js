const { MongoMemoryServer } = require('mongodb-memory-server');
const { asValue } = require('awilix');

module.exports = (container) => {
  let mongod;

  before('Starting in-memory mongodb server...', async function() {
    // eslint-disable-next-line no-invalid-this
    this.timeout(10000);
    mongod = new MongoMemoryServer({ autoStart: false });

    await mongod.start();

    const uri = await mongod.getConnectionString();
    // eslint-disable-next-line no-unused-vars
    const port = await mongod.getPort();
    // eslint-disable-next-line no-unused-vars
    const dbPath = await mongod.getDbPath();
    const dbName = await mongod.getDbName();

    const config = container.resolve('config');
    config.db = {
      uri,
      dbName,
    };

    container.register({ config: asValue(config) });
  });

  after('Stopping in-memory mongodb server...', () => {
    mongod.stop();
  });
};
