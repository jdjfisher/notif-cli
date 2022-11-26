import axios from 'axios';
import io, { Socket } from 'socket.io-client';

export const API_URL: string = process.env.API_URL || 'https://api.notif.jdjfisher.dev';

export const createApiClient = (url?: string) =>
  axios.create({
    baseURL: url || API_URL,
    timeout: 1000,
  });

export const openSocket = async (url?: string, timeout = 1000): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    const socket = io(url || API_URL);
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
