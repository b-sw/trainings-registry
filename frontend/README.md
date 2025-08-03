# Trainings Registry

A modern React application for tracking training activities with Google OAuth authentication, built with React Router v7 and Server-Side Rendering.

## Features

- ⚡️ **React Router v7** - Modern file-based routing with SSR
- ⚛️ **React 19** - Latest React with concurrent features
- 🧭 **TypeScript** - Full type safety
- 🎨 **Tailwind CSS v4** - Modern styling with great DX
- 🔐 **Google OAuth** - Secure authentication
- 📊 **Activity Tracking** - Track running, cycling, and other activities
- 🏆 **Global Leaderboards** - Compete with other users
- 📱 **Responsive Design** - Works on all devices
- 🚀 **SSR Ready** - Server-side rendering for better SEO and performance

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google OAuth Client ID (see setup below)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd trainings-registry/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file with the required values (see Environment Setup below)

### Environment Setup

#### Required Environment Variables

Create a `.env` file in the root directory with:

```env
# Backend Configuration
VITE_BACKEND_URL=http://localhost:3000

# Google OAuth Configuration
VITE_GOOGLE_OAUTH_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

#### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google OAuth API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add your domain to "Authorized JavaScript origins":
    - For development: `http://localhost:5173`
    - For production: `https://yourdomain.com`
7. Copy the Client ID and paste it into your `.env` file as `VITE_GOOGLE_OAUTH_CLIENT_ID`

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Project Structure

```
app/
├── components/           # Reusable components
│   ├── AuthWrapper.tsx
│   ├── GoogleLoginButton.tsx
│   ├── Landing.tsx
│   └── Sidebar.tsx
├── config/              # Configuration files
│   └── env.ts
├── routes/              # Page routes (file-based routing)
│   ├── about.tsx
│   ├── my-trainings.tsx
│   └── standings.tsx
├── utils/               # Utility functions
│   └── auth.tsx
├── app.css             # Global styles
├── root.tsx            # Root layout component
└── routes.ts           # Route configuration
```

## Routes

- `/` - Redirects to My Trainings (or shows landing page if not authenticated)
- `/my-trainings` - Personal activity tracking and statistics
- `/standings` - Global leaderboards and user rankings
- `/about` - Information about the application

## Features Overview

### Authentication

- Secure Google OAuth integration
- Persistent user sessions
- Automatic redirect to landing page for unauthenticated users

### Activity Tracking

- Log running, cycling, and other activities
- Track distance, duration, and notes
- View personal statistics and progress
- Add/edit/delete activities

### Global Standings

- View community leaderboards
- See user rankings by total distance
- Achievement badges and milestones
- User profiles with activity stats

### User Interface

- Beautiful, responsive design
- Modern sidebar navigation
- Interactive forms and modals
- Loading states and error handling

## Technologies Used

- **React 19** - UI library with latest features
- **TypeScript** - Type safety and better DX
- **React Router v7** - File-based routing with SSR
- **Tailwind CSS v4** - Utility-first CSS framework
- **Google OAuth** - Authentication provider
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and dev server

## Authentication Flow

1. User visits the application
2. If not authenticated, lands on the beautiful landing page
3. Clicks "Sign in with Google"
4. Google OAuth popup handles authentication
5. Frontend receives access token
6. Token is sent to backend for validation (when backend is available)
7. User data is stored locally and user is logged in
8. Redirected to main application with sidebar navigation

## Backend Integration

The app is designed to work with a backend API. Configure `VITE_BACKEND_URL` to point to your backend that should have:

- A `/auth/google` endpoint accepting `googleToken` in request body
- CORS configured to allow requests from your frontend domain
- User management and activity storage endpoints

## Deployment

### Frontend Only

The app can run without a backend (authentication will work locally only):

1. Build the application: `npm run build`
2. Deploy the `build/` folder to your hosting service
3. Set up environment variables in your hosting platform

### With Backend

1. Deploy your backend service first
2. Update `VITE_BACKEND_URL` to point to your production backend
3. Deploy frontend with updated environment variables

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - see LICENSE file for details
