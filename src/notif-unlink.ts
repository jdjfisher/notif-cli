#!/usr/bin/env node

import { Command } from 'commander';
import { api, getToken, setToken } from './common';

(async () => {
  const program = new Command();

  program.parse();

  const token = getToken();

  if (!token) {
    throw Error('not linked');
  }

  const payload = { cliToken: token };

  try {
    await api.post('unlink', payload);
    setToken(undefined);
    console.log('unlinked');
  } catch (error) {
    // TODO: ...
  }
})();