
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
    // Verify with the server
    const response = await api.post('/status', payload);

    // Forget the token if the server reports no link
    if (!response?.data?.linked) {
      clearConfig();
      console.log('not linked');
      return;
    }

    console.log('linked to', config.mobileDeviceName);
  } catch (error) {
    console.log('failed to connect to server');
  }
}
