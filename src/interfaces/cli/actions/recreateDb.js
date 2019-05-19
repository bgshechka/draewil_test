const SongsBag = require('../../../domain/updater/aggregate/songsBag');

module.exports = (container, runner) => async () => {
  const { SongsLibraryApi, SongRepository, baseLogger } = container.cradle;
  const logger = baseLogger.child({ namespace: 'command:recreate:db' });
  try {
    const library = await SongsLibraryApi.load();

    const songsBag = SongsBag.createFromLibrary(library);
    await SongRepository.saveBag(songsBag);
  } catch (e) {
    logger.error('Command error ', { error: e });
  }
  runner.emit('done');
};
