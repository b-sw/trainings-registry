import { useEffect, useState } from 'react';
import { config } from '~/config/env';
import { Tooltip } from '../components/Tooltip';
import type { UserSerialized } from '../utils/api';
import { trainingApi, userApi } from '../utils/api';
import { useAuth } from '../utils/auth';
import { EVENT_START_DATE_MONTH, hasEventStartedCET } from '../utils/event';

interface User {
    rank: number;
    name: string;
    email: string;
    id: string;
    totalDistance: number;
    cyclingDistance: number;
    runningDistance: number;
    walkingDistance: number;
    activitiesCount: number;
    avatarUrl?: string;
    isCurrentUser?: boolean;
}

type ActivityTab = 'all' | 'cycling' | 'running' | 'walking';

export default function Standings() {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<ActivityTab>('cycling');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const eventStarted = hasEventStartedCET() || config.IS_DEV_ENV;
    const [teamTotals, setTeamTotals] = useState<{
        total: number;
        cycling: number;
        running: number;
        walking: number;
    }>({ total: 0, cycling: 0, running: 0, walking: 0 });

    const formatKm = (value: number) => `${Math.round(value).toLocaleString()} km`;

    // On larger screens (>=640px), show All Activities by default
    useEffect(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches) {
            setActiveTab('all');
        }
    }, []);

    // Load standings data
    useEffect(() => {
        const loadStandings = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fixed date range: start of year to today
                const startDate = EVENT_START_DATE_MONTH.toISOString().split('T')[0];
                const endDate = new Date().toISOString().split('T')[0];

                // Fetch all users and their activities
                const [allUsers, userActivities] = await Promise.all([
                    userApi.getAll(),
                    trainingApi.getAllUsersActivities(startDate, endDate),
                ]);

                // Map activities to users with distance breakdown
                const usersMap = new Map<string, UserSerialized>();
                allUsers.forEach((user) => usersMap.set(user.id, user));

                // Build standings using precomputed distances from backend
                const standingsData: User[] = userActivities.map((activity, index) => {
                    const userData = usersMap.get(activity.userId);

                    const runningDistance = activity.runningDistance || 0;
                    const cyclingDistance = activity.cyclingDistance || 0;
                    const walkingDistance = activity.walkingDistance || 0;
                    const totalDistance = runningDistance + cyclingDistance + walkingDistance;

                    return {
                        rank: index + 1, // Will be recalculated based on sorting
                        name: userData?.name || 'Unknown User',
                        email: userData?.email || '',
                        id: activity.userId,
                        totalDistance,
                        cyclingDistance,
                        runningDistance,
                        walkingDistance,
                        activitiesCount: activity.totalTrainings,
                        avatarUrl: userData?.imageUrl,
                        isCurrentUser: currentUser?.id === activity.userId,
                    };
                });

                // Sort by total distance and assign ranks
                const sortedUsers = standingsData.sort((a, b) => b.totalDistance - a.totalDistance);
                sortedUsers.forEach((user, index) => {
                    user.rank = index + 1;
                });

                // Compute team totals for tiles
                const totals = userActivities.reduce(
                    (acc, a) => {
                        acc.cycling += a.cyclingDistance || 0;
                        acc.running += a.runningDistance || 0;
                        acc.walking += a.walkingDistance || 0;
                        return acc;
                    },
                    { cycling: 0, running: 0, walking: 0 } as {
                        cycling: number;
                        running: number;
                        walking: number;
                    },
                );
                const total = totals.cycling + totals.running + totals.walking;
                setTeamTotals({
                    total,
                    cycling: totals.cycling,
                    running: totals.running,
                    walking: totals.walking,
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
    }, [currentUser?.id]);

    const getRankingByCategory = (category: ActivityTab) => {
        if (category === 'all') return users;

        return [...users]
            .sort((a, b) => {
                switch (category) {
                    case 'cycling':
                        return b.cyclingDistance - a.cyclingDistance;
                    case 'running':
                        return b.runningDistance - a.runningDistance;
                    case 'walking':
                        return b.walkingDistance - a.walkingDistance;
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
            case 'walking':
                return user.walkingDistance;
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
                        className="px-4 py-2 bg-[#0161D5] text-white rounded-lg hover:bg-[#0152b5]"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { key: 'all' as const, label: 'All Activities', icon: '🏆' },
        { key: 'cycling' as const, label: 'Cycling', icon: '🚴‍♂️' },
        { key: 'running' as const, label: 'Running', icon: '🏃‍♂️' },
        { key: 'walking' as const, label: 'Walking', icon: '🚶‍♂️' },
    ];

    return (
        <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col min-h-0">
                {/* Header */}
                <div className="grid grid-cols-5 gap-3 items-end md:flex md:items-center md:justify-between mb-2 md:mb-2">
                    <div className="col-span-3">
                        <h1 className="text-2xl md:text-3xl font-oswald font-bold text-gray-900">
                            COMMUNITY IMPACT
                        </h1>
                    </div>
                    <div className="col-span-2 flex justify-end">
                        {eventStarted ? (
                            <button
                                onClick={() => (window.location.href = '/my-activities?add=true')}
                                className="font-oswald inline-flex items-center justify-center w-full md:w-auto px-3 py-1.5 md:px-4 md:py-2 bg-[#0161D5] border border-transparent rounded-md shadow-sm text-sm md:text-lg font-medium text-white hover:bg-[#0152b5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0161D5]"
                            >
                                <span className="mr-2">+</span>
                                ADD ACTIVITY
                            </button>
                        ) : (
                            <Tooltip label="The event will start on 12th of August">
                                <button
                                    onClick={() => undefined}
                                    disabled
                                    className="font-oswald inline-flex items-center justify-center w-full md:w-auto px-3 py-1.5 md:px-4 md:py-2 bg-[#0161D5] border border-transparent rounded-md shadow-sm text-sm md:text-lg font-medium text-white opacity-50 cursor-not-allowed"
                                >
                                    <span className="mr-2">+</span>
                                    ADD ACTIVITY
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>
                <p className="mt-1 md:mt-2 mb-6 md:mb-8 text-sm md:text-base text-gray-600">
                    See how you rank against other participants in various activities.
                </p>

                {/* Team Summary Tiles styled like the image */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="text-xs md:text-sm font-medium text-gray-500 flex items-center gap-2">
                            <span>🏆</span>
                            <span>Overall Moved</span>
                        </div>
                        <div className="mt-1 text-xl md:text-2xl font-oswald font-bold text-[#0161D5]">
                            {formatKm(teamTotals.total)}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="text-xs md:text-sm font-medium text-gray-500 flex items-center gap-2">
                            <span>🚴‍♂️</span>
                            <span>Cycling</span>
                        </div>
                        <div className="mt-1 text-xl md:text-2xl font-oswald font-bold text-purple-600">
                            {formatKm(teamTotals.cycling)}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="text-xs md:text-sm font-medium text-gray-500 flex items-center gap-2">
                            <span>🏃‍♂️</span>
                            <span>Running</span>
                        </div>
                        <div className="mt-1 text-xl md:text-2xl font-oswald font-bold text-green-600">
                            {formatKm(teamTotals.running)}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="text-xs md:text-sm font-medium text-gray-500 flex items-center gap-2">
                            <span>🚶‍♂️</span>
                            <span>Walking</span>
                        </div>
                        <div className="mt-1 text-xl md:text-2xl font-oswald font-bold text-amber-600">
                            {formatKm(teamTotals.walking)}
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-white rounded-lg shadow flex-1 flex flex-col min-h-0">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <nav className="flex flex-wrap gap-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`no-rounded flex items-center space-x-2 pb-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.key
                                            ? 'border-[#0161D5] text-[#0161D5]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } ${tab.key === 'all' ? 'hidden sm:flex' : ''}`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {displayUsers.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <span className="text-6xl mb-4 block">🏆</span>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No activities found
                            </h3>
                            <p className="text-gray-500">No activities added for the event yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 overflow-y-auto flex-1 min-h-0 scrollbar-custom">
                            {displayUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className={`px-6 py-4 hover:bg-gray-50 ${user.isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-400' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 w-12 text-center">
                                                <span className="text-2xl font-bold text-gray-900">
                                                    #{user.rank}
                                                </span>
                                            </div>
                                            <div className="flex-shrink-0">
                                                {user.avatarUrl ? (
                                                    <img
                                                        src={user.avatarUrl}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-600 font-medium">
                                                            {user.name?.charAt(0) || '?'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="text-base md:text-lg font-medium text-gray-900">
                                                        {user.name}
                                                        {user.isCurrentUser && (
                                                            <span className="ml-2 text-sm text-[#0161D5] font-medium">
                                                                (You)
                                                            </span>
                                                        )}
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {user.email}
                                                </p>
                                                <div className="flex items-center space-x-3 mt-1 text-xs md:text-sm text-gray-600">
                                                    <span>{user.activitiesCount} activities</span>
                                                    <span>•</span>
                                                    <span>
                                                        Avg{' '}
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
                                        {/* Hide right-side details on mobile for space */}
                                        <div className="hidden md:block text-right">
                                            <div className="text-2xl font-oswald font-bold text-gray-900">
                                                {getDistanceForTab(user, activeTab).toFixed(1)} KM
                                            </div>
                                            {activeTab === 'all' && (
                                                <div className="text-sm font-oswald text-gray-500 mt-1">
                                                    🚴‍♂️ {user.cyclingDistance.toFixed(1)} • 🏃‍♂️{' '}
                                                    {user.runningDistance.toFixed(1)} • 🚶‍♂️{' '}
                                                    {user.walkingDistance.toFixed(1)}
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
