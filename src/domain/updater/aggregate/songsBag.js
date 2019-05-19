const t = require('tcomb');

const Song = require('../entity/song');

const { CapitalizedLetter, NumberChar } = require('../../types');

const FirstLetter = t.irreducible('FirstLetterType', v => CapitalizedLetter.is(v) || NumberChar.is(v));

const type = t.dict(FirstLetter, t.list(Song.type), 'SongsBagType');

const createFromLibrary = (library) => {
  const data = library.reduce((acc, curr) => {
    const songs = curr.songs.map(item => Song.factory({ ...item, artist: curr.name }));
    songs.forEach((song) => {
      const letter = song.getFirstLetter();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(song);
    });
    return acc;
  }, {});
  return type(data);
};

module.exports = {
  type,
  createFromLibrary,
};
