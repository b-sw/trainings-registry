// Environment configuration
export const config = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
    GOOGLE_OAUTH_CLIENT_ID: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '',
    IS_DEV_ENV: (import.meta.env.VITE_IS_DEV_ENV ?? 'false') === 'true',
} as const;

// Validate required environment variables
export function validateEnvironment() {
    if (!config.GOOGLE_OAUTH_CLIENT_ID) {
        console.warn('VITE_GOOGLE_OAUTH_CLIENT_ID is not set. Google OAuth will not work.');
    }
}
