const getRequestIp = (req) => {
  const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  if (ip.includes('127.0.0.1')) {
    return '127.0.0.1';
  }

  const ips = ip.split(', ');
  if (typeof ips === 'object') {
    return ips[0];
  }
  return ip;
};

module.exports = {
  getRequestIp,
};
