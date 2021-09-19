#!/usr/bin/env node

import { Command } from 'commander';
import { api, openSocket, loadConfig, clearConfig, setConfig } from './common';
import QRCode from 'qrcode';
import os from "os";

(async () => {
  const program = new Command();

  program
    .option('-f, --force', 'force override link')
    .option('-t, --timeout <ms>', 'link timeout')
    .option('-n, --name <name>', 'speicfy a custom name for this device', os.hostname());

  program.parse();

  const config = loadConfig();

  if (config) {
    if (!program.opts().force) 
      throw Error('already linked. use "-f" to override');
    else 
      clearConfig(); // TODO: unlink server-side, re-use unlink subcommand
  }

  const response = await api.get('token');

  const token = response.data.token;

  // TODO: Handle error
  const socket = await openSocket();

  const payload = JSON.stringify({
    token: token,
    name: program.opts().name,
    socketId: socket.id,
  });
  
  const qr = await QRCode.toString(payload, {
    type: 'terminal',
    errorCorrectionLevel: 'M',
  });

  console.log(qr);

  console.log('Waiting for link. Ctrl+C to cancel');

  let linked = false; 

  try {
    // TODO: Move this promise somewhere else
    const expoDeviceName = await new Promise<string>((resolve, reject) => {
      socket.on('linked', (expoDeviceName: string) => {
        linked = true;
        resolve(expoDeviceName);
      });
  
      const timeout = program.opts().timeout;
  
      if (timeout) {
        setTimeout(() => {
          if (!linked) reject('timeout exceeded');
        }, timeout);
      }
    });

    setConfig({ token, expoDeviceName });
    console.clear();
    console.log('device linked to', expoDeviceName);

  } catch (error) {
    console.clear();
    console.log(error);
  }
})();