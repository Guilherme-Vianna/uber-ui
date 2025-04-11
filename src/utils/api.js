import { config } from "../config";

export const getApiUrl = (endpoint) => {
  return `${config.apiUrl}${endpoint}`;
};

export const isProduction = () => {
  return import.meta.env.PROD;
};

export const isDevelopment = () => {
  return import.meta.env.DEV;
};
