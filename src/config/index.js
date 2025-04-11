export const config = {
  apiUrl: import.meta.env.VUE_APP_API_BASE_URL,
};

const requiredEnvVars = ["VUE_APP_API_BASE_URL"];

requiredEnvVars.forEach((envVar) => {
  if (!import.meta.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
  }
});
