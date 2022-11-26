import fs from 'fs';
import os from 'os';
import path from 'path';

export const CONFIG_PATH: string =
  process.env.CONFIG_PATH || path.join(os.homedir(), '/.notif/settings.json');

export interface Config {
  token: string;
  customServerUrl?: string;
  cliDeviceName: string;
  mobileDeviceName: string;
}

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
