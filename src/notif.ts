import { Command } from 'commander';
import link from './notif-link';
import ping from './notif-ping';
import unlink from './notif-unlink';
import status from './notif-status';
import { actionWrapper } from './lib/util';

const program = new Command();

// eslint-disable-next-line
const manifest = require('dummy_for_node_modules/../../package.json');

program
  .version(manifest.version)
  .showHelpAfterError()
  .option('-v, --verbose', 'output extra debugging')
  .on('option:verbose', function () {
    process.env.VERBOSE = program.opts().verbose;
  });

program
  .command('link')
  .description('link this device to the mobile app')
  .option('--no-utf8')
  .option('-f, --force', 'force override link')
  .option('-t, --timeout <ms>', 'link timeout')
  .option('-s, --server <url>', 'custom server')
  .option('-n, --name <name>', 'name this device')
  .action(actionWrapper(link));

program
  .command('ping')
  .argument('[message]')
  .description('send a push notification to linked mobile device')
  .action(actionWrapper(ping));

program
  .command('status')
  .description('get the link status of this device')
  .option('-v, --verbose')
  .action(actionWrapper(status));

program
  .command('unlink')
  .description('unlink this device')
  .action(actionWrapper(unlink));

export default program;
