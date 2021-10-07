#!/usr/bin/env node

import { Command } from 'commander';
import { api, loadConfig, clearConfig } from './common';

(async () => {
  const program = new Command();

  program.parse();

  const config = loadConfig();

  // Check local config first
  if (!config) {
    console.log('not linked');
    return;
  }

  const payload = { cliToken: config.token };

  try {
    // Unlink server-side
    await api.post('unlink', payload);

    // Forget local token
    clearConfig();

    console.log('unlinked from', config.expoDeviceName);
  } catch (error) {
    console.log('failed to unlink from ', config.expoDeviceName);
  }
})();
