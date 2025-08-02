# Trainings Registry Setup Guide

## Environment Configuration

This project uses **Vite's built-in environment variable handling** through `import.meta.env`. To enable Google OAuth login and backend communication, you'll need to create a `.env` file with the following configuration:

### 1. Create `.env` file

Create a `.env` file in the root directory with:

```env
# Backend Configuration
VITE_BACKEND_URL=http://localhost:3000

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### 2. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add your domain to "Authorized JavaScript origins":
    - For development: `http://localhost:5173`
    - For production: `https://yourdomain.com`
7. Copy the Client ID and paste it into your `.env` file as `VITE_GOOGLE_CLIENT_ID`

### 3. Backend Configuration

Make sure your backend is running on the URL specified in `VITE_BACKEND_URL`. The backend should have:

-   A `/auth/google` endpoint that accepts a `googleToken` in the request body
-   CORS configured to allow requests from your frontend domain

### 4. Install Dependencies

```bash
yarn install
```

### 5. Run the Application

For development:

```bash
yarn dev
```

For production:

```bash
yarn build
yarn serve
```

## Features

-   **Landing Page**: Modern, responsive design with Google OAuth login
-   **Authentication**: Secure Google OAuth integration with backend
-   **SSR Support**: Server-side rendering for better SEO and performance
-   **Responsive Design**: Works on both desktop and mobile devices
-   **User Management**: User profile display and logout functionality

## Authentication Flow

1. User clicks "Sign in with Google" on the landing page
2. Google OAuth popup/redirect handles user authentication
3. Google returns an access token
4. Frontend sends the token to backend `/auth/google` endpoint
5. Backend validates token and returns user information
6. User is logged in and redirected to the main application

## Troubleshooting

### Common Issues

1. **"Google Client ID not found"**: Make sure `VITE_GOOGLE_CLIENT_ID` is set in your `.env` file
2. **CORS errors**: Configure your backend to allow requests from your frontend domain
3. **Authentication fails**: Check that your Google OAuth configuration matches your domain
4. **Backend connection fails**: Verify `VITE_BACKEND_URL` points to your running backend

### Environment Variables

All environment variables for Vite must be prefixed with `VITE_` to be accessible in the frontend code. Vite automatically loads environment variables from `.env` files and makes them available through `import.meta.env`:

-   **Client-side**: Variables are available at build time through `import.meta.env.VITE_*`
-   **SSR**: Environment variables work seamlessly in server-side rendering

This is the standard Vite approach for environment variable management.
