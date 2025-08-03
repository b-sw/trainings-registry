import type { ReactNode } from 'react';
import { useAuth } from '../utils/auth';
import { Landing } from './Landing';

interface AuthWrapperProps {
    children: ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Landing />;
    }

    return <>{children}</>;
};
