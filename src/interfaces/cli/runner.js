const program = require('commander');

const recreateDbAction = require('./actions/recreateDb');

module.exports = ({ container }) => {
  program.command('recreate:db')
    .description('Script for recreate songs database')
    .action(recreateDbAction(container, program));

  program.on('done', () => {
    process.exit(0);
  });

  return program;
};
