#!/usr/bin/env node

import { Command } from 'commander';
import { api, getToken, setToken } from './common';
import QRCode from 'qrcode';
const os = require("os");

(async () => {
  const program = new Command();

  program.parse();

  const token = getToken();

  if (!token) {
    throw Error('not linked');
  }

  const payload = { token };

  try {
    await api.post('unlink', payload);
    setToken(undefined);
    console.log('unlinked');
  } catch (error) {
    // TODO: ...
  }
})();