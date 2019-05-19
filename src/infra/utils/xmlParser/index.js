const { parseString } = require('xml2js');

module.exports = xmlString => new Promise((resolve, reject) => {
  parseString(xmlString, (err, result) => {
    if (result) {
      resolve(result);
    }
    reject(err);
  });
});
