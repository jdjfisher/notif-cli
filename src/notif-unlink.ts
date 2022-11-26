import { loadConfig, clearConfig } from './lib/config';
import { createApiClient } from './lib/api';

export default async () => {
  const config = loadConfig();

  // Check local config first
  if (!config) {
    console.log('not linked');
    return;
  }

  const api = createApiClient(config);

  try {
    // Unlink server-side
    await api.post('/client/unlink');

    // Forget local token
    clearConfig();

    console.log('unlinked from', config.mobileDeviceName);
  } catch (error) {
    console.log('failed to unlink from', config.mobileDeviceName);
  }
};
