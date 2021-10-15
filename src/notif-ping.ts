#!/usr/bin/env node

import axios, { AxiosError } from 'axios';
import { Command } from 'commander';
import { api, loadConfig, clearConfig } from './common';

(async () => {
  const program = new Command();

  program.option('-m, --message <content>', 'specify a message for the push notification');

  program.parse();

  const config = loadConfig();

  if (!config) {
    console.log('not linked');
    return;
  }

  const payload = {
    cliToken: config.token,
    cliDeviceName: config.cliDeviceName,
    message: program.opts().message,
  };

  api
    .post('ping', payload)
    .then(() => {
      console.log('ping sent to', config.mobileDeviceName);
    })
    .catch((error: Error | AxiosError) => {
      if (axios.isAxiosError(error) && error?.response?.status === 409) {
        console.log('not linked');
        clearConfig();
      } else {
        console.log('failed to send ping');
      }
    });
})();
