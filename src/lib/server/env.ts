import { NODE_ENV, VERCEL_ENV } from '$env/static/private';

export const isProduction = NODE_ENV === 'production' && VERCEL_ENV === 'production';
export const isPreview = VERCEL_ENV === 'preview';
export const isDevelopment = NODE_ENV === 'development';
