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
  return fs.readFileSync(CONFIG_PATH, 'utf8');
}

export const setToken = (token?: string): void => {
  fs.writeFileSync(CONFIG_PATH, token,{ encoding: 'utf8', flag: 'w' });
}

export const openSocket = (): Socket => {
  return io(API_URL);
}