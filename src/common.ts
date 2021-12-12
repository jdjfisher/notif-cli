import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import fs from 'fs';
import path from 'path';

export const API_URL: string = process.env.API_URL || 'http://api.notif.jdjfisher.dev:8000';
export const CONFIG_PATH: string = process.env.CONFIG_PATH || path.join(process.env.HOME || '~', '/.notif/settings.json');

export interface Config {
  token: string;
  cliDeviceName: string;
  mobileDeviceName: string;
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

export const loadConfig = (): Config | null => {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(raw) as Config;
  } catch (error) {
    return null;
  }
};

export const setConfig = (config: Config): void => {
  if (config) {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config), { encoding: 'utf8', flag: 'w' });
  } else {
    fs.unlinkSync(CONFIG_PATH);
  }
};

export const clearConfig = (): void => {
  fs.unlinkSync(CONFIG_PATH);
};

export const openSocket = async (timeout: number = 1000): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    const socket = io(API_URL);
    let connected = false;

    socket.on('connect', () => {
      connected = true;
      resolve(socket);
    });

    setTimeout(() => {
      if (!connected) reject();
    }, timeout);
  });
};
