import { useState } from 'react'

interface Activity {
    id: string
    type: 'cycling' | 'running' | 'other'
    distance: number
    duration: number // in minutes
    date: string
    notes?: string
}

const MyTrainings = () => {
    const [activities, setActivities] = useState<Activity[]>([
        {
            id: '1',
            type: 'running',
            distance: 5.2,
            duration: 35,
            date: '2024-01-15',
            notes: 'Morning run in the park',
        },
        {
            id: '2',
            type: 'cycling',
            distance: 25.8,
            duration: 90,
            date: '2024-01-14',
            notes: 'Weekend bike ride',
        },
        {
            id: '3',
            type: 'running',
            distance: 8.1,
            duration: 55,
            date: '2024-01-12',
            notes: 'Long run training',
        },
        {
            id: '4',
            type: 'other',
            distance: 3.0,
            duration: 45,
            date: '2024-01-10',
            notes: 'Swimming session',
        },
    ])

    const [showAddForm, setShowAddForm] = useState(false)
    const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
        type: 'running',
        distance: 0,
        duration: 0,
        date: new Date().toISOString().split('T')[0],
        notes: '',
    })

    // Calculate stats
    const totalDistance = activities.reduce(
        (sum, activity) => sum + activity.distance,
        0
    )
    const cyclingDistance = activities
        .filter(a => a.type === 'cycling')
        .reduce((sum, a) => sum + a.distance, 0)
    const runningDistance = activities
        .filter(a => a.type === 'running')
        .reduce((sum, a) => sum + a.distance, 0)
    const otherDistance = activities
        .filter(a => a.type === 'other')
        .reduce((sum, a) => sum + a.distance, 0)

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'cycling':
                return '🚴‍♂️'
            case 'running':
                return '🏃‍♂️'
            case 'other':
                return '🏊‍♂️'
            default:
                return '💪'
        }
    }

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'cycling':
                return 'bg-blue-100 text-blue-800'
            case 'running':
                return 'bg-green-100 text-green-800'
            case 'other':
                return 'bg-purple-100 text-purple-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const handleAddActivity = () => {
        if (newActivity.distance > 0 && newActivity.duration > 0) {
            const activity: Activity = {
                ...newActivity,
                id: Date.now().toString(),
            }
            setActivities([activity, ...activities])
            setNewActivity({
                type: 'running',
                distance: 0,
                duration: 0,
                date: new Date().toISOString().split('T')[0],
                notes: '',
            })
            setShowAddForm(false)
        }
    }

    const handleDeleteActivity = (id: string) => {
        setActivities(activities.filter(activity => activity.id !== id))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Activities
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Track your fitness activities and monitor your progress
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <span>+</span>
                    <span>Add Activity</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Distance
                    </h3>
                    <div className="text-2xl font-bold text-gray-900">
                        {totalDistance.toFixed(1)} km
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                        🚴‍♂️ Cycling
                    </h3>
                    <div className="text-2xl font-bold text-blue-600">
                        {cyclingDistance.toFixed(1)} km
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                        🏃‍♂️ Running
                    </h3>
                    <div className="text-2xl font-bold text-green-600">
                        {runningDistance.toFixed(1)} km
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                        💪 Other
                    </h3>
                    <div className="text-2xl font-bold text-purple-600">
                        {otherDistance.toFixed(1)} km
                    </div>
                </div>
            </div>

            {/* Add Activity Form */}
            {showAddForm && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Add New Activity
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Activity Type
                            </label>
                            <select
                                value={newActivity.type}
                                onChange={e =>
                                    setNewActivity({
                                        ...newActivity,
                                        type: e.target
                                            .value as Activity['type'],
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="running">🏃‍♂️ Running</option>
                                <option value="cycling">🚴‍♂️ Cycling</option>
                                <option value="other">💪 Other Activity</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                value={newActivity.date}
                                onChange={e =>
                                    setNewActivity({
                                        ...newActivity,
                                        date: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Distance (km)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={newActivity.distance || ''}
                                onChange={e =>
                                    setNewActivity({
                                        ...newActivity,
                                        distance:
                                            parseFloat(e.target.value) || 0,
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                value={newActivity.duration || ''}
                                onChange={e =>
                                    setNewActivity({
                                        ...newActivity,
                                        duration: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes (optional)
                            </label>
                            <input
                                type="text"
                                value={newActivity.notes}
                                onChange={e =>
                                    setNewActivity({
                                        ...newActivity,
                                        notes: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add any notes about your activity..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddActivity}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Activity
                        </button>
                    </div>
                </div>
            )}

            {/* Activities List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Recent Activities
                    </h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {activities.map(activity => (
                        <div
                            key={activity.id}
                            className="px-6 py-4 hover:bg-gray-50"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="text-2xl">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getActivityColor(
                                                    activity.type
                                                )}`}
                                            >
                                                {activity.type}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {activity.date}
                                            </span>
                                        </div>
                                        <div className="mt-1">
                                            <span className="font-semibold text-gray-900">
                                                {activity.distance} km
                                            </span>
                                            <span className="text-gray-500 mx-2">
                                                •
                                            </span>
                                            <span className="text-gray-600">
                                                {activity.duration} minutes
                                            </span>
                                            {activity.notes && (
                                                <>
                                                    <span className="text-gray-500 mx-2">
                                                        •
                                                    </span>
                                                    <span className="text-gray-600 italic">
                                                        {activity.notes}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        handleDeleteActivity(activity.id)
                                    }
                                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete activity"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyTrainings
