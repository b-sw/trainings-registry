import { Link, useLocation } from 'react-router';
import { useAuth } from '../utils/auth';
import logo from '../welcome/logo.svg';

interface SidebarProps {
    onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navigation = [
        {
            name: 'My activities',
            href: '/my-trainings',
            icon: '💪',
        },
        {
            name: 'Top performers',
            href: '/standings',
            icon: '🏆',
        },
        {
            name: 'About',
            href: '/about',
            icon: 'ℹ️',
        },
    ];

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            {/* Logo/Brand */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200">
                <Link
                    to="/my-trainings"
                    className="flex items-center space-x-3"
                    onClick={onNavigate}
                >
                    <img src={logo} alt="Move for Ukraine logo" className="w-8 h-8" />
                    <span className="text-2xl font-bold brand-title text-[#0161D5]">
                        MOVE FOR UKRAINE
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 pt-4">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`sidebar-item ${isActive ? 'active' : ''}`}
                            onClick={onNavigate}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="px-4 py-2 border-t border-gray-200">
                <div className="flex items-center space-x-3 px-4 py-3">
                    {user?.imageUrl || user?.picture ? (
                        <img
                            src={user.imageUrl || user.picture!}
                            alt={user?.name || 'User avatar'}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-sm font-medium">
                                {user?.name?.charAt(0) || '?'}
                            </span>
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Logout */}
            <div className="px-4 py-4 border-t border-gray-200">
                <button
                    onClick={() => {
                        logout();
                        onNavigate?.();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full"
                >
                    <span className="text-lg">🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
