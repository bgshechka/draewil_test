const t = require('tcomb');

const { Timestamp, NumberChar, CapitalizedLetter } = require('../../types');

const type = t.struct({
  id: t.Integer,
  name: t.String,
  duration: Timestamp,
  artist: t.String,
});

type.prototype.getFirstLetter = function() {
  const letter = this.name.split('')
    .find((c) => {
      const capitalized = c.toUpperCase();
      return NumberChar.is(capitalized) || CapitalizedLetter.is(capitalized);
    });
  return letter.toUpperCase();
};

type.prototype.getLastLetter = function() {
  const letter = this.name.split('')
    .reverse()
    .find((c) => {
      const capitalized = c.toUpperCase();
      return NumberChar.is(capitalized) || CapitalizedLetter.is(capitalized);
    });
  return letter.toUpperCase();
};

const factory = data => type(data);

module.exports = {
  type,
  factory,
};
