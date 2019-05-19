const Song = require('../../../domain/updater/entity/song');

/**
 * @class SongRepository
 */
class SongRepository {
  /**
   * @param {Mongoose} storage
   */
  constructor({ storage }) {
    this.storage = storage;
  }

  /**
   * @return {Promise<void>}
   */
  clearStorage() {
    return this.storage.connection.dropDatabase();
  }

  /**
   * @param {SongsBag} bag
   * @return {Promise<void>}
   */
  saveBag(bag) {
    return this.clearStorage()
      .then(() =>
        Promise.all(Object.entries(bag)
          .map(([letter, songs]) =>
            this.storage.connection.createCollection(letter)
              .then(() => this.storage.connection.collection(letter).insertMany(songs, { forceServerObjectId: true }))
          )
        )
      );
  }

  /**
   * @param {string} letter
   * @return {Promise<Song | null>}
   */
  getRandomSong(letter) {
    return this.storage.connection.collection(letter).aggregate([{ $sample: { size: 1 } }]).next()
      .then(data => data ? Song.factory(data) : null);
  }

  /**
   * @return {Promise<string[]>}
   */
  async getAvaliableLetters() {
    const collections = await this.storage.connection.db.listCollections({}, { nameOnly: true }).toArray();
    return collections.map(item => item.name);
  }
}

module.exports = SongRepository;
