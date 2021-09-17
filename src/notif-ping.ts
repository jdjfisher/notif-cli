#!/usr/bin/env node

import { Command } from 'commander';
import { api, getToken, setToken } from './common';
import QRCode from 'qrcode';
const os = require("os");

(async () => {
  const program = new Command();

  program
    .option('-m, --message <content>', 'foo bar');

  program.parse();

  let token = getToken();

  if (!token) {
    throw Error('not linked');
  }

  const payload = { 
    cliToken: token,
    message: program.opts().message,
  };

  try {
    await api.post('ping', payload);
    console.log('ping delivered');
  } catch (error) {
    // 
  }
})();