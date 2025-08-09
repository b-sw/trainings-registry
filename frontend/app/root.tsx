import React from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import { GoogleOAuthProvider } from '@react-oauth/google';
import type { LinksFunction } from 'react-router';
import { AuthWrapper } from './components/AuthWrapper';
import { Sidebar } from './components/Sidebar';
import { config, validateEnvironment } from './config/env';
import { AuthProvider } from './utils/auth';

import './app.css';

export const links: LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
    },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap',
    },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap',
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Trainings Registry</title>
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    // Validate environment variables on startup
    if (typeof window !== 'undefined') {
        validateEnvironment();
    }

    return (
        <GoogleOAuthProvider clientId={config.GOOGLE_OAUTH_CLIENT_ID}>
            <AuthProvider>
                <AuthWrapper>
                    <div className="flex h-screen bg-gray-50">
                        {/* Sidebar */}
                        <div className="w-80 flex-shrink-0">
                            <Sidebar />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <main className="flex-1 overflow-y-auto">
                                <div className="p-8 h-full">
                                    <Outlet />
                                </div>
                            </main>
                        </div>
                    </div>
                </AuthWrapper>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}
