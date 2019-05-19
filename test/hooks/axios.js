const { asValue } = require('awilix');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

module.exports = (container) => {
  beforeEach('Mock Axios', () => {
    container.register({ mocker: asValue(new MockAdapter(axios)) });
  });

  afterEach('Unmock Axios', () => {
  });
};
