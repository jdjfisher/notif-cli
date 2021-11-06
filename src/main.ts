#!/usr/bin/env node

import dotenv from 'dotenv';
import program from './notif';

dotenv.config();
program.parse(process.argv);