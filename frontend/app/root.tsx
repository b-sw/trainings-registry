import React, { useEffect, useState } from 'react';
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import type { LinksFunction } from 'react-router';
import { AuthWrapper } from './components/AuthWrapper';
import { Sidebar } from './components/Sidebar';
import { config, validateEnvironment } from './config/env';
import { AuthProvider } from './utils/auth';
import logo from './welcome/logo.svg';

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
                <title>Move for Ukraine 2025</title>
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

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const location = useLocation();

    // Close mobile sidebar on route changes
    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    return (
        <GoogleOAuthProvider clientId={config.GOOGLE_OAUTH_CLIENT_ID}>
            {/* Mount Toaster globally so it works on both Landing and authenticated screens */}
            <Toaster position="top-right" />
            <AuthProvider>
                <AuthWrapper>
                    <div className="flex h-screen bg-gray-50">
                        {/* Desktop Sidebar */}
                        <div className="hidden md:block w-80 flex-shrink-0">
                            <Sidebar />
                        </div>

                        {/* Mobile Sidebar Overlay */}
                        {isMobileSidebarOpen && (
                            <div className="fixed inset-0 z-40 md:hidden">
                                <div
                                    className="absolute inset-0 bg-black/40"
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                />
                                <div className="absolute inset-y-0 left-0 w-full bg-white shadow-xl">
                                    <Sidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
                                </div>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Top bar for mobile */}
                            <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                                <button
                                    aria-label="Open menu"
                                    className="p-2 rounded-full border border-gray-300"
                                    onClick={() => setIsMobileSidebarOpen(true)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="#4B5563"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                        />
                                    </svg>
                                </button>
                                <Link to="/my-trainings" className="flex items-center space-x-3">
                                    <img
                                        src={logo}
                                        alt="Move for Ukraine logo"
                                        className="w-8 h-8"
                                    />
                                    <span className="text-2xl font-bold brand-title">
                                        MOVE FOR UKRAINE
                                    </span>
                                </Link>
                                <span className="w-8" />
                            </div>

                            <main className="flex-1 overflow-hidden">
                                <div className="p-4 md:p-8 h-full">
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
