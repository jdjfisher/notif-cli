#!/usr/bin/env node

import { Command } from 'commander';
import { api, getToken, openSocket, setToken } from './common';
import QRCode from 'qrcode';
const os = require("os");

(async () => {
  const program = new Command();

  program
    .option('-f, --force', 'force override link');
  // TODO: Option to view QR as png

  program.parse();

  let token = getToken();

  if (token) {
    if (!program.opts().force) 
      throw Error('already linked. use -f to override');
    // else 
      // TODO: unlink
  }

  const response = await api.get('token');

  token = response.data.token;

  const payload = JSON.stringify({
    token: token,
    name: os.hostname(),
  });
  
  setToken(token);

  const qr = await QRCode.toString(payload, {type: 'terminal'});
  console.log(qr);

  // const socket = openSocket();
  // const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  // let linked = false; 
  // socket.on('linked', () => {
  //   linked = true;
  // });

  // for (let i = 0; i < 10; i++){
  //   if (linked)
  //     break;

  //   await delay(1000);
  // }

  // console.log(linked ? 'device linked', 'timeout reached');
})();