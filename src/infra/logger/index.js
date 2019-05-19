const { createLogger, format, transports } = require('winston');

module.exports = ({ config }) => {
  const {
    combine, timestamp, colorize, simple, printf,
  } = format;

  const environment = format((info) => {
    // eslint-disable-next-line no-param-reassign
    info.NODE_ENV = process.env.NODE_ENV;
    return info;
  });

  const errorFormat = format((info) => {
    const replaceError = ({
      label, level, message, stack,
    }) => ({
      label, level, message, stack,
    });

    if (info.error instanceof Error) {
      // eslint-disable-next-line no-param-reassign
      info.error = replaceError(info.error);
    }
    return info;
  });

  const filename = format((info) => {
    if (info.filename && typeof info.filename === 'string') {
      // eslint-disable-next-line no-param-reassign
      info.filename = info.filename.split('src').pop();
    } else {
      // eslint-disable-next-line no-param-reassign
      info.filename = null;
    }
    return info;
  });

  const logLevel = config.logger.console.level;

  const printFormat = ({ verbose = false } = {}) => (info) => {
    const {
      timestamp: rawTs,
      level,
      message,
      NODE_ENV,
      filename,
      namespace = '*',
      requestUuid,
      durationMs,
      responseStatus,
      error,
    } = info;

    const ts = rawTs.slice(0, 19).replace('T', ' ');

    let logStringPrefix = `${ts} (${filename || namespace})(${NODE_ENV})[${level}]`;
    if (requestUuid) {
      logStringPrefix = `${logStringPrefix}[${requestUuid}]`;
    }

    let logString = `${logStringPrefix}: ${message}`;

    if (responseStatus) {
      logString = `${logString} -- ${responseStatus}`;
    }

    if (durationMs !== undefined) {
      logString = `${logString} -- ${durationMs}ms`;
    }
    if (verbose) {
      logString = `${logString} ${error && error.stack ? `\n${error.stack}` : ''}`;
    }

    return logString;
  };

  const consoleConfig = {
    level: logLevel,
    format: combine(
      errorFormat(),
      colorize(),
      timestamp(),
      simple(),
      environment(),
      filename(),
      printf(printFormat()),
    ),
  };

  // const consoleTransport = new transports.Console(consoleConfig);
  const consoleVerboseTransport = new transports.Console({
    ...consoleConfig,
    format: combine(
      consoleConfig.format,
      printf(printFormat({ verbose: true })),
    ),
  });

  const logger = createLogger();
  switch (process.env.NODE_ENV) {
    case 'development':
      logger.add(consoleVerboseTransport);
      break;
    case 'production':
    case 'test':
    default:
      logger.add(consoleVerboseTransport);
  }

  return logger;
};
