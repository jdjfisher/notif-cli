import axios from 'axios';

export const API_URL: string = process.env.API_URL || 'https://notif.jdjfisher.dev';

export const createApiClient = ({
  customServerUrl,
  token,
}: {
  customServerUrl?: string;
  token?: string;
}) =>
  axios.create({
    baseURL: `${customServerUrl || API_URL}/api`,
    headers: {
      common: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    },
    timeout: 1000,
  });
