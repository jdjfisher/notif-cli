import { loadConfig, clearConfig, createApiClient } from './lib';

export default async () => {
  const config = loadConfig();

  // Check local config first
  if (!config) {
    console.log('not linked');
    return;
  }

  const api = createApiClient(config.customServerUrl);

  const payload = { token: config.token };

  try {
    // Unlink server-side
    await api.post('/client/unlink', payload);

    // Forget local token
    clearConfig();

    console.log('unlinked from', config.mobileDeviceName);
  } catch (error) {
    console.log('failed to unlink from ', config.mobileDeviceName);
  }
};
