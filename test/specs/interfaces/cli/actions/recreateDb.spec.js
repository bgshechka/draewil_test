const { expect } = require('chai');

const container = require('../../../../../src/app/cli');
const mongodbMock = require('../../../../hooks/mongodb');
const axiosMock = require('../../../../hooks/axios');

const recreateDbAction = require('../../../../../src/interfaces/cli/actions/recreateDb');

const { getXmlSongsLibraryOf } = require('./fixtures');

describe('CLI: recreate db', () => {
  mongodbMock(container);
  axiosMock(container);

  it('should recreate songs db', async () => {
    const { xml, songs } = getXmlSongsLibraryOf(10);

    const { mocker, database } = container.cradle;
    await database.connect();

    mocker.onGet('testLibUrl')
      .replyOnce(200, xml);

    const fakeRunner = { emit: () => null };
    await recreateDbAction(container, fakeRunner)();

    const { mongoose } = database;

    const collections = await mongoose.connection.db.listCollections({}, { nameOnly: true }).toArray();
    const collectionNames = collections.map(item => item.name);

    const grouped = songs.reduce((acc, curr) => {
      const letter = curr.name.charAt(0).toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(curr);
      return acc;
    }, {});

    expect(Object.keys(grouped)).to.have.members(collectionNames);

    const savedSongs = await Promise.all(
      collectionNames.map(name => mongoose.connection.collection(name).find({}).toArray())
    );

    collectionNames.forEach((name, index) => {
      const savedSongsWithoutId = savedSongs[index].map((item) => {
        const newItem = { ...item };
        delete newItem._id;
        return newItem;
      });
      expect(savedSongsWithoutId).to.have.deep.members(grouped[name]);
    });
  });
});
