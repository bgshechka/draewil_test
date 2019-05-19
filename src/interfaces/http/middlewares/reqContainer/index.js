const { asFunction } = require('awilix');
const uuidv4 = require('uuid/v4');

const { getRequestIp } = require('../../../../utils/request');

module.exports = (container) => {
  return (req, res, next) => {
    const requestUuid = uuidv4();
    const requestInfo = {
      ip: getRequestIp(req),
      method: req.method,
      url: req.originalUrl,
    };

    req.container = container.createScope();

    req.container.register({
      requestUuid: asFunction(() => requestUuid).scoped(),
      requestInfo: asFunction(() => requestInfo).scoped(),
    });

    return next();
  };
};
