import { useState } from 'react'

interface User {
    rank: number
    name: string
    totalDistance: number
    cyclingDistance: number
    runningDistance: number
    otherDistance: number
    activitiesCount: number
    avatar: string
    isCurrentUser?: boolean
}

type ActivityTab = 'all' | 'cycling' | 'running' | 'other'

export default function Standings() {
    const [activeTab, setActiveTab] = useState<ActivityTab>('all')

    // Mock leaderboard data - this would come from your backend
    const users: User[] = [
        {
            rank: 1,
            name: 'Alex Thompson',
            totalDistance: 245.8,
            cyclingDistance: 180.2,
            runningDistance: 45.6,
            otherDistance: 20.0,
            activitiesCount: 24,
            avatar: '🏆',
        },
        {
            rank: 2,
            name: 'Sarah Johnson',
            totalDistance: 238.4,
            cyclingDistance: 156.8,
            runningDistance: 61.6,
            otherDistance: 20.0,
            activitiesCount: 22,
            avatar: '🥈',
        },
        {
            rank: 3,
            name: 'Michael Chen',
            totalDistance: 215.2,
            cyclingDistance: 134.5,
            runningDistance: 68.7,
            otherDistance: 12.0,
            activitiesCount: 19,
            avatar: '🥉',
        },
        {
            rank: 4,
            name: 'You',
            totalDistance: 189.3,
            cyclingDistance: 125.8,
            runningDistance: 43.5,
            otherDistance: 20.0,
            activitiesCount: 18,
            avatar: '👤',
            isCurrentUser: true,
        },
        {
            rank: 5,
            name: 'Emily Zhang',
            totalDistance: 172.6,
            cyclingDistance: 98.4,
            runningDistance: 54.2,
            otherDistance: 20.0,
            activitiesCount: 16,
            avatar: '👩‍💻',
        },
    ]

    // Get current user data
    const currentUser = users.find((user) => user.isCurrentUser)!

    // Calculate rankings by category
    const cyclingRanking = [...users].sort((a, b) => b.cyclingDistance - a.cyclingDistance)
    const runningRanking = [...users].sort((a, b) => b.runningDistance - a.runningDistance)
    const otherRanking = [...users].sort((a, b) => b.otherDistance - a.otherDistance)

    const getCurrentUserRank = (category: ActivityTab) => {
        switch (category) {
            case 'cycling':
                return cyclingRanking.findIndex((user) => user.isCurrentUser) + 1
            case 'running':
                return runningRanking.findIndex((user) => user.isCurrentUser) + 1
            case 'other':
                return otherRanking.findIndex((user) => user.isCurrentUser) + 1
            default:
                return currentUser.rank
        }
    }

    const getDisplayUsers = () => {
        switch (activeTab) {
            case 'cycling':
                return cyclingRanking.map((user, index) => ({
                    ...user,
                    rank: index + 1,
                    displayDistance: user.cyclingDistance,
                }))
            case 'running':
                return runningRanking.map((user, index) => ({
                    ...user,
                    rank: index + 1,
                    displayDistance: user.runningDistance,
                }))
            case 'other':
                return otherRanking.map((user, index) => ({
                    ...user,
                    rank: index + 1,
                    displayDistance: user.otherDistance,
                }))
            default:
                return users.map((user) => ({
                    ...user,
                    displayDistance: user.totalDistance,
                }))
        }
    }

    const getTabIcon = (tab: ActivityTab) => {
        switch (tab) {
            case 'cycling':
                return '🚴‍♂️'
            case 'running':
                return '🏃‍♂️'
            case 'other':
                return '💪'
            default:
                return '🏆'
        }
    }

    const getTabLabel = (tab: ActivityTab) => {
        switch (tab) {
            case 'cycling':
                return 'Cycling'
            case 'running':
                return 'Running'
            case 'other':
                return 'Other Activities'
            default:
                return 'All Activities'
        }
    }

    const tabs: ActivityTab[] = ['all', 'cycling', 'running', 'other']

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Global Standings</h1>
                <p className="text-gray-600 mt-2">
                    See how you rank among other athletes across all activities
                </p>
            </div>

            {/* User Summary Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">🏆 Overall Rank</h3>
                    <div className="text-2xl font-bold text-blue-600">#{currentUser.rank}</div>
                    <p className="text-gray-600 text-sm">
                        {currentUser.totalDistance.toFixed(1)} km total
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">🚴‍♂️ Cycling Rank</h3>
                    <div className="text-2xl font-bold text-blue-600">
                        #{getCurrentUserRank('cycling')}
                    </div>
                    <p className="text-gray-600 text-sm">
                        {currentUser.cyclingDistance.toFixed(1)} km
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">🏃‍♂️ Running Rank</h3>
                    <div className="text-2xl font-bold text-green-600">
                        #{getCurrentUserRank('running')}
                    </div>
                    <p className="text-gray-600 text-sm">
                        {currentUser.runningDistance.toFixed(1)} km
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">💪 Other Rank</h3>
                    <div className="text-2xl font-bold text-purple-600">
                        #{getCurrentUserRank('other')}
                    </div>
                    <p className="text-gray-600 text-sm">
                        {currentUser.otherDistance.toFixed(1)} km
                    </p>
                </div>
            </div>

            {/* Activity Tabs and Leaderboard */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="flex items-center space-x-2">
                                    <span>{getTabIcon(tab)}</span>
                                    <span>{getTabLabel(tab)}</span>
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Leaderboard */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {getTabLabel(activeTab)} Leaderboard
                    </h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {getDisplayUsers().map((user) => (
                        <div
                            key={`${activeTab}-${user.name}`}
                            className={`px-6 py-4 flex items-center justify-between ${
                                user.isCurrentUser
                                    ? 'bg-blue-50 border-l-4 border-blue-600'
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="text-2xl font-bold text-gray-400 w-8">
                                    #{user.rank}
                                </div>
                                <div className="text-2xl">{user.avatar}</div>
                                <div>
                                    <h3
                                        className={`font-semibold ${
                                            user.isCurrentUser ? 'text-blue-900' : 'text-gray-900'
                                        }`}
                                    >
                                        {user.name}
                                        {user.isCurrentUser && (
                                            <span className="ml-2 text-sm font-normal text-blue-600">
                                                (You)
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {user.activitiesCount} activities logged
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div
                                    className={`text-2xl font-bold ${
                                        user.isCurrentUser ? 'text-blue-600' : 'text-gray-900'
                                    }`}
                                >
                                    {user.displayDistance.toFixed(1)} km
                                </div>
                                <div className="text-gray-600 text-sm">
                                    {activeTab === 'all'
                                        ? 'total distance'
                                        : getTabLabel(activeTab).toLowerCase()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
