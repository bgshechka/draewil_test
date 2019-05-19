const {
  createContainer,
  asFunction,
  asValue,
  asClass,
} = require('awilix');

const app = require('./app');
const config = require('../../config');
const runner = require('../../interfaces/cli/runner');
const logger = require('../../infra/logger');
const httpTransport = require('../../infra/api/transport/http');
const SongsLibraryApi = require('../../infra/api/services/songsLibrary');
const database = require('../../infra/database');
const SongsRepository = require('../../infra/repository/song');

const container = createContainer();

container
  .register({
    app: asFunction(app).singleton(),
    runner: asFunction(runner).inject(ctnr => ({ container: ctnr })).singleton(),
    baseLogger: asFunction(logger).singleton(),
    config: asValue(config),
    httpTransport: asFunction(httpTransport).scoped(),
    SongsLibraryApi: asClass(SongsLibraryApi)
      .inject(ctnr => ({
        transport: ctnr.resolve('httpTransport'),
        url: config.songsLibraryUrl,
      }))
      .singleton(),
    database: asFunction(database).singleton(),
    SongRepository: asClass(SongsRepository)
      .inject(ctnr => ({ storage: ctnr.resolve('database').mongoose }))
      .singleton(),
  });

module.exports = container;
