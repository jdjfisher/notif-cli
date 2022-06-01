import axios from 'axios';
import { createApiClient, loadConfig, clearConfig } from './lib';

export default async (message?: string) => {
  const config = loadConfig();

  if (!config) {
    console.log('not linked');
    return;
  }

  const api = createApiClient(config.customServerUrl);

  const payload = {
    cliToken: config.token,
    cliDeviceName: config.cliDeviceName,
    message,
  };

  try {
    await api.post('/ping', payload, { timeout: 5000 });

    console.log('ping sent to', config.mobileDeviceName);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log('link broken');
      clearConfig();
    } else {
      console.log('failed to send ping');
    }
  }
};
