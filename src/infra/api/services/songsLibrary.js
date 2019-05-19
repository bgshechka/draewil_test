const xmlParse = require('../../utils/xmlParser');

/**
 * @class SongsLibraryApi
 */
class SongsLibraryApi {
  /**
   * @param {HttpTransport} transport
   * @param {string} url
   */
  constructor({ transport, url }) {
    this.transport = transport;
    this.url = url;
  }

  /**
   * @return {Promise<[]>}
   */
  load() {
    return this.transport({
      method: 'get',
      url: this.url,
    })
      .then(response => xmlParse(response.data))
      .then((data) => {
        if (data && data.Library && data.Library.Artist) {
          return data.Library.Artist;
        }
        return [];
      })
      .then(data => data.reduce((acc, curr) => {
        if (Array.isArray(curr.Song)) {
          acc.push({
            name: curr.$.name,
            songs: curr.Song.map(song => ({
              name: song.$.name,
              id: parseInt(song.$.id, 10),
              duration: parseInt(song.$.duration, 10),
            })),
          });
        }
        return acc;
      }, []));
  }
}

module.exports = SongsLibraryApi;
