const { asFunction } = require('awilix');
const onFinished = require('on-finished');

module.exports = () => (req, res, next) => {
  const { baseLogger, requestInfo, requestUuid } = req.container.cradle;

  const { method, url } = requestInfo;

  baseLogger.debug(`Request ${method} ${url}`, { requestInfo, requestUuid });
  const scopedLogger = baseLogger.child({ requestUuid });
  const profiler = scopedLogger.startTimer();

  onFinished(res, (err, response) => {
    profiler.done({
      level: 'debug',
      message: `Response ${method} ${url}`,
      responseStatus: response.statusCode,
    });
  });

  // re-register logger to forward requestUuid to all logs in scope
  req.container.register({
    logger: asFunction(() => scopedLogger).scoped(),
  });

  return next();
};
