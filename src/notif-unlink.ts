import { api, loadConfig, clearConfig } from './common';

export default async () => {
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

    console.log('unlinked from', config.mobileDeviceName);
  } catch (error) {
    console.log('failed to unlink from ', config.mobileDeviceName);
  }
};
