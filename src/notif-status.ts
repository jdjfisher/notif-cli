import { loadConfig, clearConfig } from './lib/config';
import { createApiClient } from './lib/api';
import axios from 'axios';

type Options = {
  verbose?: boolean;
};

export default async ({ verbose }: Options) => {
  const config = loadConfig();

  // Check local config first
  if (!config) {
    console.log('not linked');
    return;
  }

  const api = createApiClient(config);

  try {
    // Verify with the server
    await api.get('/client/status');

    console.log('linked to', config.mobileDeviceName);

    if (verbose) {
      console.log(config);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearConfig();
      console.log('not linked');
      return;
    }

    console.log('failed to connect to server');
  }
};
