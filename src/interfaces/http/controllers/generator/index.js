const RequestPayloads = require('./requestPayloads');

const generatePlaylist = async (req, res, next) => {
  try {
    const payload = RequestPayloads.Generate.factory(req.query);

    const { SongService } = req.container.cradle;
    const playlist = await SongService.generatePlaylist(payload);

    return res.json(playlist);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  generatePlaylist,
};
