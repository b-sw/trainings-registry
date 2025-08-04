import { useEffect, useState } from 'react';
import type { UserSerialized } from '../utils/api';
import { trainingApi, userApi } from '../utils/api';
import { useAuth } from '../utils/auth';

interface User {
    rank: number;
    name: string;
    email: string;
    id: string;
    totalDistance: number;
    cyclingDistance: number;
    runningDistance: number;
    otherDistance: number;
    activitiesCount: number;
    avatar: string;
    isCurrentUser?: boolean;
}

type ActivityTab = 'all' | 'cycling' | 'running' | 'other';

export default function Standings() {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<ActivityTab>('all');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of current year
        endDate: new Date().toISOString().split('T')[0], // Today
    });

    // Load standings data
    useEffect(() => {
        const loadStandings = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all users and their activities
                const [allUsers, userActivities] = await Promise.all([
                    userApi.getAll(),
                    trainingApi.getAllUsersActivities(dateRange.startDate, dateRange.endDate),
                ]);

                // Map activities to users with distance breakdown
                const usersMap = new Map<string, UserSerialized>();
                allUsers.forEach((user) => usersMap.set(user.id, user));

                // Get detailed trainings for distance breakdown by type
                const allTrainings = await trainingApi.getAll();
                const trainingsByUser = allTrainings.reduce(
                    (acc, training) => {
                        if (!acc[training.userId]) {
                            acc[training.userId] = [];
                        }
                        acc[training.userId].push(training);
                        return acc;
                    },
                    {} as Record<string, typeof allTrainings>,
                );

                // Calculate distance by activity type for each user
                const standingsData: User[] = userActivities.map((activity, index) => {
                    const userData = usersMap.get(activity.userId);
                    const userTrainings = trainingsByUser[activity.userId] || [];

                    // Calculate distances by type based on training title/description
                    let cyclingDistance = 0;
                    let runningDistance = 0;
                    let otherDistance = 0;

                    userTrainings.forEach((training) => {
                        const title = training.title.toLowerCase();
                        const description = training.description.toLowerCase();

                        if (
                            title.includes('run') ||
                            description.includes('run') ||
                            title.includes('jog')
                        ) {
                            runningDistance += training.distance;
                        } else if (
                            title.includes('cycl') ||
                            description.includes('bike') ||
                            title.includes('cycl')
                        ) {
                            cyclingDistance += training.distance;
                        } else {
                            otherDistance += training.distance;
                        }
                    });

                    return {
                        rank: index + 1, // Will be recalculated based on sorting
                        name: userData?.name || 'Unknown User',
                        email: userData?.email || '',
                        id: activity.userId,
                        totalDistance: activity.totalDistance,
                        cyclingDistance,
                        runningDistance,
                        otherDistance,
                        activitiesCount: activity.totalTrainings,
                        avatar: getAvatarForUser(userData?.name || 'Unknown', index),
                        isCurrentUser: currentUser?.id === activity.userId,
                    };
                });

                // Sort by total distance and assign ranks
                const sortedUsers = standingsData.sort((a, b) => b.totalDistance - a.totalDistance);
                sortedUsers.forEach((user, index) => {
                    user.rank = index + 1;
                });

                setUsers(sortedUsers);
            } catch (err) {
                console.error('Failed to load standings:', err);
                setError('Failed to load standings. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadStandings();
    }, [currentUser?.id, dateRange.startDate, dateRange.endDate]);

    const getAvatarForUser = (name: string, index: number): string => {
        if (index === 0) return '🏆';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';

        // Generate avatar based on name
        const avatars = ['👨‍💻', '👩‍💻', '🧑‍💼', '👨‍🔬', '👩‍🔬', '🧑‍🎨', '👨‍🏫', '👩‍🏫', '🧑‍⚕️', '👨‍⚖️'];
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return avatars[hash % avatars.length];
    };

    // Get current user data
    const currentUserData = users.find((user) => user.isCurrentUser);

    // Calculate rankings by category
    const getRankingByCategory = (category: ActivityTab) => {
        if (category === 'all') return users;

        return [...users]
            .sort((a, b) => {
                switch (category) {
                    case 'cycling':
                        return b.cyclingDistance - a.cyclingDistance;
                    case 'running':
                        return b.runningDistance - a.runningDistance;
                    case 'other':
                        return b.otherDistance - a.otherDistance;
                    default:
                        return b.totalDistance - a.totalDistance;
                }
            })
            .map((user, index) => ({ ...user, rank: index + 1 }));
    };

    const displayUsers = getRankingByCategory(activeTab);

    const getDistanceForTab = (user: User, tab: ActivityTab): number => {
        switch (tab) {
            case 'cycling':
                return user.cyclingDistance;
            case 'running':
                return user.runningDistance;
            case 'other':
                return user.otherDistance;
            default:
                return user.totalDistance;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading standings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Global Standings</h1>
                    <p className="mt-2 text-gray-600">
                        See how you rank against other team members in various activities.
                    </p>
                </div>

                {/* Date Range Filter */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Date Range</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) =>
                                    setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) =>
                                    setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                </div>

                {/* User Summary Cards */}
                {currentUserData && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">
                                🏆 Overall Rank
                            </h3>
                            <div className="text-2xl font-bold text-blue-600">
                                #{currentUserData.rank}
                            </div>
                            <p className="text-gray-600 text-sm">
                                {currentUserData.totalDistance.toFixed(1)} km total
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">
                                🚴‍♂️ Cycling Rank
                            </h3>
                            <div className="text-2xl font-bold text-blue-600">
                                #
                                {getRankingByCategory('cycling').findIndex(
                                    (user) => user.isCurrentUser,
                                ) + 1}
                            </div>
                            <p className="text-gray-600 text-sm">
                                {currentUserData.cyclingDistance.toFixed(1)} km
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">
                                🏃‍♂️ Running Rank
                            </h3>
                            <div className="text-2xl font-bold text-green-600">
                                #
                                {getRankingByCategory('running').findIndex(
                                    (user) => user.isCurrentUser,
                                ) + 1}
                            </div>
                            <p className="text-gray-600 text-sm">
                                {currentUserData.runningDistance.toFixed(1)} km
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">
                                🏊‍♂️ Other Rank
                            </h3>
                            <div className="text-2xl font-bold text-purple-600">
                                #
                                {getRankingByCategory('other').findIndex(
                                    (user) => user.isCurrentUser,
                                ) + 1}
                            </div>
                            <p className="text-gray-600 text-sm">
                                {currentUserData.otherDistance.toFixed(1)} km
                            </p>
                        </div>
                    </div>
                )}

                {/* Activity Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { key: 'all' as const, label: 'All Activities', icon: '🏆' },
                                { key: 'cycling' as const, label: 'Cycling', icon: '🚴‍♂️' },
                                { key: 'running' as const, label: 'Running', icon: '🏃‍♂️' },
                                { key: 'other' as const, label: 'Other', icon: '🏊‍♂️' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                                        activeTab === tab.key
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            {activeTab === 'all'
                                ? 'Overall'
                                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{' '}
                            Rankings
                        </h3>
                    </div>

                    {displayUsers.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <span className="text-6xl mb-4 block">🏆</span>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No activities found
                            </h3>
                            <p className="text-gray-500">
                                No activities recorded for the selected date range.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {displayUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className={`px-6 py-4 hover:bg-gray-50 ${
                                        user.isCurrentUser
                                            ? 'bg-blue-50 border-l-4 border-blue-400'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 w-12 text-center">
                                                <span className="text-2xl font-bold text-gray-900">
                                                    #{user.rank}
                                                </span>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className="text-4xl">{user.avatar}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="text-lg font-medium text-gray-900">
                                                        {user.name}
                                                        {user.isCurrentUser && (
                                                            <span className="ml-2 text-sm text-blue-600 font-medium">
                                                                (You)
                                                            </span>
                                                        )}
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {user.email}
                                                </p>
                                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                    <span>{user.activitiesCount} activities</span>
                                                    <span>•</span>
                                                    <span>
                                                        Avg:{' '}
                                                        {user.activitiesCount > 0
                                                            ? (
                                                                  getDistanceForTab(
                                                                      user,
                                                                      activeTab,
                                                                  ) / user.activitiesCount
                                                              ).toFixed(1)
                                                            : '0.0'}{' '}
                                                        km
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {getDistanceForTab(user, activeTab).toFixed(1)} km
                                            </div>
                                            {activeTab === 'all' && (
                                                <div className="text-sm text-gray-500 mt-1">
                                                    🚴‍♂️ {user.cyclingDistance.toFixed(1)} • 🏃‍♂️{' '}
                                                    {user.runningDistance.toFixed(1)} • 🏊‍♂️{' '}
                                                    {user.otherDistance.toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
