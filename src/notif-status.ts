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
    // Verify with the server
    const response = await api.post('verify', payload);

    // Forget the token if the server reports no link
    if (!response?.data?.linked) {
      clearConfig();
      console.log('not linked');
      return;
    }

    console.log('linked to', config.expoDeviceName);
  } catch (error) {
    // TODO: ...
  }
})();
