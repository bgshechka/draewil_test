const {
  createContainer,
  asFunction,
  asValue,
  asClass,
} = require('awilix');

const app = require('./app');
const config = require('../../config');
const server = require('../../interfaces/http/server');
const logger = require('../../infra/logger');
const httpTransport = require('../../infra/api/transport/http');
const database = require('../../infra/database');
const SongsRepository = require('../../infra/repository/song');
const SongServise = require('../../domain/generator/service/song');

const container = createContainer();

container
  .register({
    app: asFunction(app).singleton(),
    server: asFunction(server).inject(ctnr => ({ container: ctnr })).singleton(),
    baseLogger: asFunction(logger).singleton(),
    config: asValue(config),
    httpTransport: asFunction(httpTransport).scoped(),
    database: asFunction(database).singleton(),
    SongRepository: asClass(SongsRepository)
      .inject(ctnr => ({ storage: ctnr.resolve('database').mongoose }))
      .singleton(),
    SongService: asClass(SongServise)
      .inject(ctnr => ({ repository: ctnr.resolve('SongRepository') }))
      .singleton(),
  });

module.exports = container;
