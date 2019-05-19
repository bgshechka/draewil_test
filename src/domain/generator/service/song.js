const { getRandomElement } = require('../../../utils/array');

/**
 * @class SongService
 */
class SongService {
  /**
   * @param {SongRepository} repository
   */
  constructor({ repository }) {
    this.repository = repository;
  }

  /**
   * @param {int?} count
   * @param {int?} duration
   * @return {Promise<[string]>}
   */
  async generatePlaylist({ count, duration }) {
    const letters = await this.repository.getAvaliableLetters();
    const initLetter = getRandomElement(letters);
    const buffer = [];

    let checker = () => false;
    if (count) {
      checker = buff => buff.length >= count;
    }
    if (duration) {
      checker = (buff) => {
        const totalDuration = buff.reduce((acc, curr) => acc + curr.duration, 0);
        return totalDuration >= duration;
      };
    }

    const getSong = (letter) => {
      if (checker(buffer)) {
        return Promise.resolve(buffer);
      }
      return this.repository.getRandomSong(letter)
        .then((song) => {
          if (!song) {
            return Promise.resolve(buffer);
          }
          buffer.push(song);
          return getSong(song.getLastLetter());
        });
    };

    return getSong(initLetter)
      .then(list => list.map(song => song.name));
  }
}

module.exports = SongService;
