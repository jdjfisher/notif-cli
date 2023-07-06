import axios from 'axios';

export const actionWrapper =
  <T>(fn: (options: T) => Promise<void>) =>
  async (options: T) => {
    try {
      await fn(options);
    } catch (error) {
      if (axios.isAxiosError(error) && process.env.VERBOSE) {
        console.error('server error', error.message);
      } else {
        console.error('error');
      }

      process.exit(1);
    }
  };
