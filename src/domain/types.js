const t = require('tcomb');

const { genCharArray } = require('../utils/string');

const Timestamp = t.irreducible('TimestampType', v => t.Integer.is(v));

const CAPITALIZED_LETTERS = genCharArray('A', 'Z');
const CapitalizedLetter = t.irreducible(
  'CapitalizedLetterType',
  v => t.String.is(v) && CAPITALIZED_LETTERS.includes(v)
);

const NUMBERS = genCharArray('0', '9');
const NumberChar = t.irreducible('NumberCharType', v => NUMBERS.includes(v));

module.exports = {
  Timestamp,
  NumberChar,
  CapitalizedLetter,
};
