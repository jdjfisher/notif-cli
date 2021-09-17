#!/usr/bin/env node

import { Command } from 'commander';
import { api, getToken, openSocket, setToken } from './common';
import QRCode from 'qrcode';
const os = require("os");

(async () => {
  const program = new Command();

  program
    .option('-f, --force', 'force override link')
    .option('-t, --timeout <ms>', 'ttl')
    // .option('-n, --name', 'speicfy a custom name for this device');

  program.parse();

  let token = getToken();

  if (token) {
    if (!program.opts().force) 
      throw Error('already linked. use -f to override');
    else 
      // TODO: unlink server-side
      setToken(undefined);
  }

  const response = await api.get('token');

  token = response.data.token;

  // TODO: Handle error
  const socket = await openSocket();

  const payload = JSON.stringify({
    token: token,
    name: os.hostname(),
    socketId: socket.id,
  });
  
  const qr = await QRCode.toString(payload, {type: 'terminal'});

  console.log(qr);

  console.log('Waiting for link. Ctrl+C to cancel');

  let linked = false; 

  try {
    await new Promise<void>((resolve, reject) => {
      socket.on('linked', () => {
        linked = true;
        resolve();
      });
  
      const timeout = program.opts().timeout;
  
      if (timeout) {
        setTimeout(() => {
          if (!linked) reject('timeout exceeded');
        }, timeout);
      }
    });
  } catch (error) {
    console.clear();
    console.log(error);
    return;
  }

  console.clear();

  if (!linked) {
    console.log('link expired');
    return;
  }

  setToken(token);
  
  console.log('device linked');
})();