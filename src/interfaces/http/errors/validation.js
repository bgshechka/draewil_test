/**
 * @class ValidationError
 */
class ValidationError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.code = 422;
  }
}

module.exports = ValidationError;
