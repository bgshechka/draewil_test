const t = require('tcomb-validation');

const ValidationError = require('../../../errors/validation');

const type = t.struct({
  count: t.maybe(t.Integer),
  duration: t.maybe(t.Integer),
});

const factory = (data) => {
  const casted = {};
  if (data.count) {
    casted.count = parseInt(data.count, 10);
  }
  if (data.duration) {
    casted.duration = parseInt(data.duration, 10);
  }

  const validationResult = t.validate(casted, type);
  if (!validationResult.isValid()) {
    const message = validationResult.firstError().message;
    throw new ValidationError(message);
  }
  if ((!data.count && !data.duration)) {
    throw new ValidationError('One of query parameter is required: count, duration');
  }
  return type(casted);
};

const Generate = {
  type,
  factory,
};

module.exports = {
  Generate,
};
