#!/usr/bin/env node

import { Command } from 'commander';
import { VERSION } from './common';

const program = new Command();

program
  .version(VERSION)
  .command('link', 'link this device to the mobile app')
  .command('ping', 'send a notification to the linked device')
  .command('unlink', 'unlink this device')
  .command('status', 'sitrep');

program.parse();
