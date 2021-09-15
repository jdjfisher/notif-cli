#!/usr/bin/env node

import { Command } from 'commander';
import { api, getToken, setToken } from './common';
import QRCode from 'qrcode';
const os = require("os");

(async () => {
  const program = new Command();

  program.parse();

  let token = getToken();

  if (!token) {
    console.log('not linked');
    return; 
  }

  const payload = { token };

  try {
    // TODO: Validate link with server. If invalid, unset token
    // const response = await api.get('verify', payload);

    // if () {
    //   setToken(undefined);
    //   console.log('not linked');
    //   return;
    // }

    // console.log('this device is linked to ...');
  } catch (error) {
    // 
  }
})();