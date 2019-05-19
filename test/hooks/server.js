const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

module.exports = (container) => {
  const app = container.resolve('app');

  before(async () => {
    await app.start();
  });

  after(async () => {
    await app.stop();
  });

  return {
    getRequester: () => chai.request(container.resolve('server').instance),
  };
};
