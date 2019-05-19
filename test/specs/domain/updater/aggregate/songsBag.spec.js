const expect = require('chai').expect;

const SongsBag = require('../../../../../src/domain/updater/aggregate/songsBag');

describe('Domain: Songs Bag', () => {
  it('should create from library', () => {
    const library = [...new Array(5)].map((item, index) => ({
      name: index.toString(),
      songs: [...new Array(3)].map((song, sIndex) => ({
        id: parseInt(`${index}${sIndex}`, 10),
        duration: parseInt(`${index}${sIndex}`, 10),
        name: `${index}${sIndex}`,
      })),
    }));

    const songsBag = SongsBag.createFromLibrary(library);
    [...new Array(5)].forEach((item, index) => {
      expect(songsBag).to.have.property(index.toString());
      expect(songsBag[index]).to.be.an('array').that.has.lengthOf(3);
      songsBag[index].forEach((song, sIndex) => {
        expect(song.id).to.be.equal(parseInt(`${index}${sIndex}`, 10));
        expect(song.name).to.be.equal(`${index}${sIndex}`);
        expect(song.duration).to.be.equal(parseInt(`${index}${sIndex}`, 10));
        expect(song.artist).to.be.equal(index.toString());
      });
    });
  });
});
