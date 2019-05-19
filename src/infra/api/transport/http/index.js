const axios = require('axios');
const util = require('util');

module.exports = ({ baseLogger }) => {
  const logger = baseLogger.child();
  const instance = axios.create();

  instance.interceptors.request.use(
    (config) => {
      const { method, baseURL = '', url, params, data } = config;
      const paramsStr = util.inspect(params, false, 2);
      const dataStr = util.inspect(data, false, 2);
      logger.debug(`Request [${method}] ${baseURL}${url} -> params: ${paramsStr} | data: ${dataStr}`);
      return config;
    },
    error => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => {
      const { status, data, config: { method, baseURL = '', url } } = response;
      logger.debug(`Response [${status}][${method}] ${baseURL}${url} <- data: ${util.inspect(data, false, 2)}`);
      return response;
    },
    error => Promise.reject(error)
  );

  return instance;
};
