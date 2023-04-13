import { loadConfig, clearConfig, setConfig } from './lib/config';
import { createApiClient } from './lib/api';
import os from 'os';
import QRCode from 'qrcode';
import { exit } from 'process';
import Pusher from 'pusher-js';

type Options = {
  name?: string;
  timeout?: number;
  server?: string;
  force?: boolean;
  utf8?: boolean;
};

export default async ({ name, timeout, force, utf8, server: customServerUrl }: Options) => {
  const config = loadConfig();

  //
  if (config) {
    const api = createApiClient(config);

    try {
      if (!force) {
        // Verify with the server
        const response = await api.get('/client/status');

        // Forget the token if the server reports no link
        if (!response.data?.linked) {
          clearConfig();
        } else {
          console.log('already linked. use "-f" to override');
          return;
        }
      } else {
        // Unlink server-side
        await api.post('/client/unlink');

        // Forget local token
        clearConfig();

        console.log('unlinked from', config.mobileDeviceName);
      }
    } catch (error) {
      console.log('failed to connect to server');
      return;
    }
  }

  const api = createApiClient({ customServerUrl });

  // Check thing
  if (customServerUrl) {
    try {
      await api.get('health');
    } catch (error) {
      console.log('failed to connect to server');
      return;
    }
  }

  let clientToken: string;
  let linkCode: string;
  let pusherKey: string;

  try {
    const response = await api.get('/client/token');
    clientToken = response.data.client_token;
    linkCode = response.data.link_code;
    pusherKey = response.data.pusher_key;
  } catch (error) {
    console.log('failed to connect to server');
    return;
  }

  const pusher = new Pusher(pusherKey, { cluster: 'eu' });

  const cliDeviceName = (name ?? os.hostname()).substring(0, 15);

  const payload = JSON.stringify({
    name: cliDeviceName,
    code: linkCode,
  });

  // Generate QR link
  const qr = await QRCode.toString(payload, {
    type: utf8 ? 'utf8' : 'terminal',
    errorCorrectionLevel: 'M',
  });

  console.log(qr);
  console.log('Waiting for link. Ctrl+C to cancel');

  let linked = false;

  try {
    // Wait for a socket event confirming the link
    const mobileDeviceName = await new Promise<string>((resolve, reject) => {
      pusher.subscribe(linkCode).bind('linked', (mobileDeviceName: string) => {
        linked = true;
        resolve(mobileDeviceName);
      });

      if (timeout) {
        setTimeout(() => {
          if (!linked) reject('timeout exceeded');
        }, timeout);
      }
    });

    // Persist link data
    setConfig({ token: clientToken, mobileDeviceName, cliDeviceName, customServerUrl });
    console.clear();
    console.log('device linked to', mobileDeviceName);
  } catch (error) {
    console.clear();
    console.log(error);
  }

  exit(0);
};
