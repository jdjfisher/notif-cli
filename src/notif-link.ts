#!/usr/bin/env node

import { Command } from 'commander';
import { api, openSocket, loadConfig, clearConfig, setConfig } from './common';
import QRCode from 'qrcode';
import os from 'os';
import { exit } from 'process';
import { Socket } from 'socket.io-client';

(async () => {
  const program = new Command();

  program
    .option('--no-utf8')
    .option('-f, --force', 'force override link')
    .option('-t, --timeout <ms>', 'link timeout')
    .option('-n, --name <name>', 'name this device', os.hostname());

  program.parse();

  const config = loadConfig();

  if (config) {
    const payload = { cliToken: config.token };

    try {
      if (!program.opts().force) {
        // Verify with the server
        const response = await api.post('status', payload);

        // Forget the token if the server reports no link
        if (!response?.data?.linked) {
          clearConfig();
        } else {
          console.log('already linked. use "-f" to override');
          return;
        }
      } else {
        // Unlink server-side
        await api.post('unlink', payload);

        // Forget local token
        clearConfig();

        console.log('unlinked from', config.mobileDeviceName);
      }
    } catch (error) {
      console.log('failed to connect to server');
    }
  }

  let token: string;
  let socket: Socket;
  
  try {
    const reponse = await api.get<{ token: string }>('token');
    token = reponse.data.token;
    socket = await openSocket();
  } catch (error) {
    console.log('failed to connect to server')
    return;
  }

  const cliDeviceName = program.opts().name.substring(0, 15)

  const payload = JSON.stringify({
    token: token,
    name: cliDeviceName,
    socketId: socket.id,
  });

  // Generate QR link
  const qr = await QRCode.toString(payload, {
    type: program.opts().utf8 ? 'utf8' : 'terminal',
    errorCorrectionLevel: 'M',
  });

  console.log(qr);
  console.log('Waiting for link. Ctrl+C to cancel');

  let linked = false;

  try {
    // Wait for a socket event confirming the link
    const mobileDeviceName = await new Promise<string>((resolve, reject) => {
      socket.on('linked', (mobileDeviceName: string) => {
        linked = true;
        resolve(mobileDeviceName);
      });

      const timeout = program.opts().timeout;

      if (timeout) {
        setTimeout(() => {
          if (!linked) reject('timeout exceeded');
        }, timeout);
      }
    });

    // Persist link data
    setConfig({ token, mobileDeviceName, cliDeviceName });
    console.clear();
    console.log('device linked to', mobileDeviceName);
    exit(0);
  } catch (error) {
    console.clear();
    console.log(error);
  }
})();
