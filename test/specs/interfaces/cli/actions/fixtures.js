const faker = require('faker');
const xml2js = require('xml2js');

const getXmlSongsLibraryOf = (count, artistsCount = 5) => {
  const artistNames = [...new Array(artistsCount)]
    .map(() => faker.name.findName());

  const songs = [...new Array(count)].map(() => ({
    name: faker.lorem.sentence().replace('.', ''),
    id: faker.random.number(),
    duration: faker.random.number(),
    artist: faker.random.arrayElement(artistNames),
  }));

  const library = artistNames.reduce((acc, curr) => {
    const artistSongs = songs.filter(song => song.artist === curr);
    return [...acc, {
      Artist: {
        $: { name: curr },
        Song: artistSongs.map(song => ({
          $: {
            name: song.name,
            id: song.id.toString(),
            duration: song.duration.toString(),
          },
        })),
      },
    }];
  }, []);

  const builder = new xml2js.Builder({ rootName: 'Library', headless: true });
  const xml = builder.buildObject(library);
  return { xml, songs };
};

module.exports = {
  getXmlSongsLibraryOf,
};
