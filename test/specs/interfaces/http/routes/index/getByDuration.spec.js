const { expect } = require('chai');

const container = require('../../../../../../src/app/http');
const mongodbMock = require('../../../../../hooks/mongodb');
const serverMock = require('../.././../../../hooks/server');

const { getSongsWithDurationListOf } = require('./fixtures');

describe('Generate Playlist By Duration', () => {
  mongodbMock(container);
  const { getRequester } = serverMock(container);

  it('should successfully generate playlist', async () => {
    const { database } = container.cradle;
    const { mongoose } = database;

    const { dbSongs } = getSongsWithDurationListOf(200);

    await Promise.all(Object.entries(dbSongs)
      .map(([letter, songs]) =>
        mongoose.connection.createCollection(letter)
          .then(() => mongoose.connection.collection(letter).insertMany(songs, { forceServerObjectId: true }))
      )
    );

    const res = await getRequester()
      .get(`/`)
      .query({
        duration: 100000,
      });

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array').that.has.lengthOf(10);

    const firstLetters = res.body.slice(1).map(name => name.charAt(0).toUpperCase());
    const lastLetters = res.body.slice(0, -1).map(name => name.charAt(name.length -1).toUpperCase());
    expect(firstLetters).to.be.deep.equal(lastLetters);
  });
});
