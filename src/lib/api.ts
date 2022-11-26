import axios from 'axios';
import io, { Socket } from 'socket.io-client';

export const API_URL: string = process.env.API_URL || 'https://api.notif.jdjfisher.dev';

export const createApiClient = ({
  customServerUrl,
  token,
}: {
  customServerUrl?: string;
  token?: string;
}) =>
  axios.create({
    baseURL: customServerUrl || API_URL,
    headers: {
      common: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    },
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
