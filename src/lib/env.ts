const getEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

const env = {
  JWT_SECRET: getEnv('JWT_SECRET'),
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default env;