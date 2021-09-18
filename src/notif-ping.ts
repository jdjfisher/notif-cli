#!/usr/bin/env node

import { Command } from 'commander';
import { api, loadConfig } from './common';

(async () => {
  const program = new Command();

  program
    .option('-m, --message <content>', 'specify a message for the push notification')
    // .option('-d, --delay <ms>', 'add a delay to the ping');

  program.parse();

  const config = loadConfig();

  if (!config) {
    console.log('not linked');
    return;
  }

  const payload = { 
    cliToken: config.token,
    message: program.opts().message,
  };

  try {
    await api.post('ping', payload);
    console.log('ping sent to', config.expoDeviceName);
  } catch (error) {
    console.log('failed to send ping');
  }
})();