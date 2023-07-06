import { loadConfig, clearConfig, setConfig } from './lib/config';
import { createApiClient } from './lib/api';
import os from 'os';
import QRCode from 'qrcode';
import { exit } from 'process';
import Pusher from 'pusher-js';
import axios from 'axios';

interface Options {
  name?: string;
  timeout?: number;
  server?: string;
  force?: boolean;
  utf8?: boolean;
}

interface TokenResponse {
  client_token: string;
  link_code: string;
  pusher_key: string;
}

export default async ({
  name,
  timeout,
  force,
  utf8,
  server: customServerUrl,
}: Options) => {
  const existingLink = await checkForExistingLink(force);

  if (existingLink) {
    console.log('already linked. use "-f" to override');
    return;
  }

  const { client_token, link_code, pusher_key } = await generateToken(
    customServerUrl
  );

  const cliDeviceName = (name ?? os.hostname()).substring(0, 15);

  const payload = JSON.stringify({
    name: cliDeviceName,
    code: link_code,
  });

  // Generate QR link
  const qr = await QRCode.toString(payload, {
    type: utf8 ? 'utf8' : 'terminal',
    errorCorrectionLevel: 'M',
  });

  console.log(qr);
  console.log('Waiting for link. Ctrl+C to cancel');

  const mobileDeviceName = await waitForLink(pusher_key, link_code, timeout);

  setConfig({
    token: client_token,
    mobileDeviceName,
    cliDeviceName,
    customServerUrl,
  });

  console.clear();
  console.log('device linked to', mobileDeviceName);

  exit(0);
};

async function checkForExistingLink(force = false): Promise<boolean> {
  const config = loadConfig();

  if (!config) {
    return false;
  }

  const api = createApiClient(config);

  if (!force) {
    try {
      // Check with the server
      await api.get('/client/status');

      return true;
    } catch (error) {
      // We can't be sure if the server is down or if the token is invalid
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        throw error;
      }
    }
  } else {
    // Unlink server-side
    await api.post('/client/unlink');
  }

  // Clear local token
  clearConfig();
  console.log('unlinked from', config.mobileDeviceName);

  return false;
}

async function generateToken(customServerUrl?: string): Promise<TokenResponse> {
  const api = createApiClient({ customServerUrl });

  const response = await api.get('/client/token');

  return response.data;
}

async function waitForLink(
  pusherKey: string,
  linkCode: string,
  timeout?: number
): Promise<string> {
  const pusher = new Pusher(pusherKey, { cluster: 'eu' });

  let linked = false;

  // Wait for a socket event confirming the link
  return await new Promise<string>((resolve, reject) => {
    pusher.subscribe(linkCode).bind('linked', (mobileDeviceName: string) => {
      linked = true;
      resolve(mobileDeviceName);
    });

    if (timeout) {
      setTimeout(() => {
        if (!linked) {
          console.clear();
          console.log('timeout exceeded.');
          exit(0);
        }
      }, timeout);
    }
  });
}
