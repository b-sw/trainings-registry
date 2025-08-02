import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../utils/auth'

const Sidebar = () => {
    const location = useLocation()
    const { user, logout } = useAuth()

    const navigation = [
        {
            name: 'My Activities',
            href: '/my-trainings',
            icon: '💪',
        },
        {
            name: 'Global Standings',
            href: '/standings',
            icon: '🏆',
        },
        {
            name: 'About',
            href: '/about',
            icon: 'ℹ️',
        },
    ]

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            {/* Logo/Brand */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200">
                <Link
                    to="/my-trainings"
                    className="flex items-center space-x-3"
                >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">T</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                        Trainings Registry
                    </span>
                </Link>
            </div>

            {/* Search */}
            <div className="px-4 py-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">🔍</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search users by ID, email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navigation.map(item => {
                    const isActive = location.pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`sidebar-item ${
                                isActive ? 'active' : ''
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile */}
            <div className="px-4 py-2 border-t border-gray-200">
                <div className="flex items-center space-x-3 px-4 py-3">
                    {user?.picture ? (
                        <img
                            src={user.picture}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
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
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full"
                >
                    <span className="text-lg">🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
