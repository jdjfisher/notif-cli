import axios from "axios";
import io, { Socket } from 'socket.io-client';
import fs from 'fs';
import path from 'path';

export const API_URL: string = 'http://localhost:8000';
export const VERSION: string = '0.0.0';
export const CONFIG_PATH: string = path.join(__dirname, '../storage/token.txt');

export const api = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

export const getToken = (): string | undefined => {
  // TODO: Redo, check if file exists
  try {
    return fs.readFileSync(CONFIG_PATH, 'utf8');
  } catch (error) {
    return undefined;
  }
}

export const setToken = (token?: string): void => {
  if (token) {
    fs.writeFileSync(CONFIG_PATH, token, { encoding: 'utf8', flag: 'w' });
  } else {
    fs.unlinkSync(CONFIG_PATH);
  }
}

export const openSocket = async (timeout: number = 1000): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    const socket = io(API_URL);
    let connected = false;

    socket.on('connect', () => {
      connected = true;
      resolve(socket);
    });

    setTimeout(() => {
      if (!connected)
        reject();
    }, timeout);
  });
}

