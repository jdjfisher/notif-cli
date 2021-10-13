#!/usr/bin/env node

import { Command } from 'commander';
import { VERSION } from './common';

const program = new Command();

program
  .version(VERSION)
  .command('link', 'link this device to the mobile app')
  .command('ping', 'send a push notification to linked mobile device')
  .command('unlink', 'unlink this device')
  .command('status', 'get the link status of this device');

program.parse();
