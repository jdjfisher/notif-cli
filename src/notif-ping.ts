import axios from 'axios';
import { loadConfig, clearConfig } from './lib/config';
import { createApiClient } from './lib/api';

export default async (message?: string) => {
  const config = loadConfig();

  if (!config) {
    console.log('not linked');
    return;
  }

  const api = createApiClient(config);

  const payload = {
    device_name: config.cliDeviceName,
    message,
  };

  try {
    await api.post('/client/ping', payload, { timeout: 5000 });

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
