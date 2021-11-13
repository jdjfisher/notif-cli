#!/usr/bin/env node

import path from 'path';
import dotenv from 'dotenv';
import program from './notif';

dotenv.config({ path: path.join(__dirname, '../.env') });
program.parse(process.argv);