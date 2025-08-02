// Environment configuration using Vite's built-in import.meta.env

export const config = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    GOOGLE_OAUTH_CLIENT_ID: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
} as const
