const faker = require('faker');

const getSongsListOf = (count, artistsCount = 5) => {
  const artistNames = [...new Array(artistsCount)]
    .map(() => faker.name.findName());

  const songs = [...new Array(count)].map(() => ({
    name: faker.lorem.sentence().replace('.', ''),
    id: faker.random.number(),
    duration: faker.random.number(),
    artist: faker.random.arrayElement(artistNames),
  }));

  const dbSongs = songs.reduce((acc, curr) => {
    const letter = curr.name.charAt(0).toUpperCase();
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(curr);
    return acc;
  }, {});

  return { songs, dbSongs };
};

const getSongsWithDurationListOf = (count, artistsCount = 5) => {
  const artistNames = [...new Array(artistsCount)]
    .map(() => faker.name.findName());

  const songs = [...new Array(count)].map(() => ({
    name: faker.lorem.sentence().replace('.', ''),
    id: faker.random.number(),
    duration: 10000,
    artist: faker.random.arrayElement(artistNames),
  }));

  const dbSongs = songs.reduce((acc, curr) => {
    const letter = curr.name.charAt(0).toUpperCase();
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(curr);
    return acc;
  }, {});

  return { songs, dbSongs };
};

module.exports = {
  getSongsListOf,
  getSongsWithDurationListOf,
};
