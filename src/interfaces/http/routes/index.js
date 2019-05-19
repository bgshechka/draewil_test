const { Router } = require('express');

const songsGeneratorController = require('../controllers/generator');

module.exports = () => {
  const router = Router();

  router.get('/', songsGeneratorController.generatePlaylist);

  return router;
};
