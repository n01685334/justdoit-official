const getEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

export const getBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URLs
    return '';
  }
  // Server-side:
  // If NEXT_PUBLIC_BASE_URL is set (full URL with protocol), use it
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // If running on Vercel, VERCEL_URL is the host (e.g., my-app.vercel.app)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback to localhost
  return 'http://localhost:3000';
};

export const env = {
  JWT_SECRET: getEnv('JWT_SECRET'),
  NODE_ENV: process.env.NODE_ENV || 'development',
};