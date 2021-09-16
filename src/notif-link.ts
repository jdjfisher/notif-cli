#!/usr/bin/env node

import { Command } from 'commander';
import { api, getToken, openSocket, setToken } from './common';
import QRCode from 'qrcode';
const os = require("os");

(async () => {
  const program = new Command();

  program
    .option('-f, --force', 'force override link');
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

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let linked = false; 

  socket.on('linked', () => {
    linked = true;
  });

  for (let i = 0; i < 1000; i++){
    if (linked)
      break;

    console.log('hi');

    await delay(1000);
  }

  console.clear();

  if (!linked) {
    console.log('link expired');
    return;
  }

  setToken(token);
  
  console.log('device linked');
})();