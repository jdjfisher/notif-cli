import { Command } from 'commander';
import link from './notif-link';
import ping from './notif-ping';
import unlink from './notif-unlink';
import status from './notif-status';


const program = new Command();

const manifest = require("dummy_for_node_modules/../../package.json");
program.version(manifest.version);

program
  .command('link')
  .description('link this device to the mobile app')
  .option('--no-utf8')
  .option('-f, --force', 'force override link')
  .option('-t, --timeout <ms>', 'link timeout')
  .option('-s, --server <url>', 'custom server')
  .option('-n, --name <name>', 'name this device')
  .action((options) => link(options));

program
  .command('ping')
  .argument('[message]')
  .description('send a push notification to linked mobile device')
  .action((message) => ping(message));

program
  .command('unlink')
  .description('unlink this device')
  .action(unlink);

program
  .command('status')
  .description('get the link status of this device')
  .action(status);

export default program;