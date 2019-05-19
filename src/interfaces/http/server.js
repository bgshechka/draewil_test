const express = require('express');
const bodyParser = require('body-parser');

const reqContainer = require('./middlewares/reqContainer');
const reqLogger = require('./middlewares/reqLogger');
const routes = require('./routes');

module.exports = ({ container }) => {
  const { baseLogger, config } = container.cradle;
  const logger = baseLogger.child({ namespace: 'server' });

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(reqContainer(container)); // make scoped container for request & collect request info
  app.use(reqLogger()); // make scoped logger for request

  app.use('/', routes());

  app.use((err, req, res, next) => {
    const scopedLogger = req.container.resolve('logger');
    scopedLogger.error(
      `Error: ${req.method} ${err.code || err.errorCode} ${err.name || ''} ${err.message || ''}`,
      { error: err }
    );

    const getErrorStatusCode = (err) => {
      const code = err.code || err.errorCode || 500;
      return Number.isInteger(code) ? code : 500;
    };

    return res.status(getErrorStatusCode(err))
      .json(err.message)
      .end();
  });

  let instance;
  return {
    app,

    start() {
      const { port } = config;

      app.set('port', port);
      instance = app.listen(port, () => {
        logger.info(`Express server listening on port ${app.get('port')}`);
      });
    },

    stop() {
      this.instance.close();
    },

    get instance() {
      return instance;
    },
  };
};
