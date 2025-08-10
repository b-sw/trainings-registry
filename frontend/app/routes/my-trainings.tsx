import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router';
import type { Activity } from '../utils/api';
import { mapTrainingToActivity, trainingApi } from '../utils/api';
import { useAuth } from '../utils/auth';

export default function MyTrainings() {
    const { user } = useAuth();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const [showAddForm, setShowAddForm] = useState(() => searchParams.get('add') === 'true');
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(0);
    const limit = 20;
    const observerRef = useRef<HTMLDivElement>(null);

    const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
        type: 'running',
        distance: 0,
        duration: 0,
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    // Load activities with pagination
    const loadActivities = useCallback(
        async (skipCount: number = 0, append: boolean = false) => {
            if (!user?.id) return;

            try {
                if (!append) {
                    setLoading(true);
                } else {
                    setLoadingMore(true);
                }
                setError(null);

                const response = await trainingApi.getUserTrainingsPaginated(
                    user.id,
                    skipCount,
                    limit,
                );
                const mappedActivities = response.trainings.map(mapTrainingToActivity);

                if (append) {
                    setActivities((prev) => [...prev, ...mappedActivities]);
                } else {
                    setActivities(mappedActivities);
                }

                setHasMore(response.hasMore);
                setSkip(skipCount + response.trainings.length);
            } catch (err) {
                console.error('Failed to load activities:', err);
                setError('Failed to load activities. Please try again.');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [user?.id, limit],
    );

    // Load more activities when scrolling
    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore && user?.id) {
            loadActivities(skip, true);
        }
    }, [loadActivities, loadingMore, hasMore, skip, user?.id]);

    // Initial load
    useEffect(() => {
        loadActivities(0, false);
    }, [loadActivities]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasMore && !loadingMore) {
                    loadMore();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px',
            },
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [loadMore, hasMore, loadingMore]);

    // Calculate stats
    const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
    const cyclingDistance = activities
        .filter((a) => a.type === 'cycling')
        .reduce((sum, a) => sum + a.distance, 0);
    const runningDistance = activities
        .filter((a) => a.type === 'running')
        .reduce((sum, a) => sum + a.distance, 0);
    const walkingDistance = activities
        .filter((a) => a.type === 'walking')
        .reduce((sum, a) => sum + a.distance, 0);

    const getActivityIcon = (type: string) =>
        type === 'running' ? '🏃‍♂️' : type === 'cycling' ? '🚴‍♂️' : '🚶‍♂️';

    const getActivityColor = (type: string) =>
        type === 'running'
            ? 'bg-green-100 text-green-800'
            : type === 'cycling'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800';

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        try {
            // Map frontend activity format to backend training format
            const trainingData = {
                userId: user.id,
                description: newActivity.notes || '',
                distance: newActivity.distance,
                date: newActivity.date,
                activityType: newActivity.type,
            };

            const createdTraining = await trainingApi.create(trainingData);
            const createdActivity = mapTrainingToActivity(createdTraining);

            // Optimistically prepend the new activity without reloading
            setActivities((prev) => [createdActivity, ...prev]);
            toast.success(
                `Added ${createdActivity.type.charAt(0).toUpperCase() + createdActivity.type.slice(1)} ${createdActivity.distance} km`,
            );

            // Reset form and close
            setNewActivity({
                type: 'running',
                distance: 0,
                duration: 0,
                date: new Date().toISOString().split('T')[0],
                notes: '',
            });
            setShowAddForm(false);

            // Do not reload list; keep pagination state intact
        } catch (err) {
            console.error('Failed to create activity:', err);

            // Prefer toast for validation/Bad Request errors and keep the page intact
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const data: any = err.response?.data;
                const serverMessage =
                    typeof data === 'string'
                        ? data
                        : data?.message || data?.error || data?.errors?.[0]?.message;

                if (status === 400) {
                    toast.error(serverMessage || 'Bad request. Please check your input.');
                    return; // Do not set global error state for 400
                }

                if (serverMessage) {
                    setError(serverMessage);
                    return;
                }
            }

            setError('Failed to create activity. Please try again.');
        }
    };

    const handleInputChange = (field: keyof typeof newActivity, value: string | number) => {
        setNewActivity((prev) => ({ ...prev, [field]: value }));
    };

    const handleDelete = async (activityId: string) => {
        try {
            await trainingApi.delete(activityId);
            setActivities((prev) => prev.filter((a) => a.id !== activityId));
        } catch (err) {
            console.error('Failed to delete activity:', err);
            setError('Failed to delete activity. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your activities...</p>
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

    return (
        <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-oswald font-bold text-gray-900">
                            MY ACTIVITIES
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Track your fitness journey and see your progress over time.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="font-oswald inline-flex items-center px-4 py-2 bg-[#0161D5] border border-transparent rounded-md shadow-sm text-lg font-medium text-white hover:bg-[#0152b5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0161D5]"
                    >
                        <span className="mr-2">+</span>
                        {showAddForm ? 'CANCEL' : 'ADD ACTIVITY'}
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Total Distance
                                </h3>
                                <p className="text-2xl font-oswald font-bold text-gray-900">
                                    {totalDistance.toFixed(1)} KM
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <span className="text-2xl">🏃‍♂️</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">Running</h3>
                                <p className="text-2xl font-oswald font-bold text-gray-900">
                                    {runningDistance.toFixed(1)} KM
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <span className="text-2xl">🚴‍♂️</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">Cycling</h3>
                                <p className="text-2xl font-oswald font-bold text-gray-900">
                                    {cyclingDistance.toFixed(1)} KM
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <span className="text-2xl">🚶‍♂️</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">Walking</h3>
                                <p className="text-2xl font-oswald font-bold text-gray-900">
                                    {walkingDistance.toFixed(1)} KM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Activity Form */}
                {showAddForm && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6 flex-shrink-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Activity</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Activity Type
                                    </label>
                                    <select
                                        value={newActivity.type}
                                        onChange={(e) => handleInputChange('type', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0161D5] focus:border-transparent"
                                    >
                                        <option value="running">Running</option>
                                        <option value="cycling">Cycling</option>
                                        <option value="walking">Walking</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Distance (km)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={newActivity.distance || ''}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'distance',
                                                parseFloat(e.target.value) || 0,
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0161D5] focus:border-transparent"
                                        placeholder="0.0"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={newActivity.date}
                                        onChange={(e) => handleInputChange('date', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0161D5] focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (optional)
                                </label>
                                <textarea
                                    value={newActivity.notes || ''}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0161D5] focus:border-transparent"
                                    placeholder="Add any notes about your activity..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="font-oswald px-4 py-2 border border-gray-300 rounded-md text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0161D5]"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    className="font-oswald px-4 py-2 bg-[#0161D5] border border-transparent rounded-md text-md font-medium text-white hover:bg-[#0152b5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0161D5]"
                                >
                                    ADD ACTIVITY
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Activities List */}
                <div className="bg-white rounded-lg shadow flex-1 flex flex-col min-h-0">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
                    </div>

                    {activities.length === 0 && !showAddForm ? (
                        <div className="px-6 py-12 text-center">
                            <span className="text-6xl mb-4 block">🚶‍♂️</span>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No activities yet
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Start tracking your fitness journey by adding your first activity.
                            </p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="font-oswald inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-lg font-medium text-white hover:bg-blue-700"
                            >
                                + ADD YOUR FIRST ACTIVITY
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-y-auto flex-1 min-h-0 scrollbar-custom">
                            <div className="divide-y divide-gray-200">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <span className="text-2xl">
                                                        {getActivityIcon(activity.type)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(
                                                                activity.type,
                                                            )}`}
                                                        >
                                                            {activity.type.charAt(0).toUpperCase() +
                                                                activity.type.slice(1)}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {activity.date}
                                                        </span>
                                                    </div>
                                                    {activity.notes && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {activity.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <p className="font-medium text-gray-900">
                                                    {activity.distance} km
                                                </p>
                                                <button
                                                    onClick={() => handleDelete(activity.id)}
                                                    title="Delete"
                                                    aria-label="Delete activity"
                                                    className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="h-5 w-5"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M9 3.75A.75.75 0 019.75 3h4.5a.75.75 0 01.75.75V6h3.75a.75.75 0 010 1.5h-.548l-1.178 12.074A3 3 0 0114.305 22.5H9.695a3 3 0 01-2.969-2.926L5.548 7.5H5a.75.75 0 010-1.5H8.75V3.75zM9 7.5h6l1.125 11.543a1.5 1.5 0 01-1.491 1.457H9.366a1.5 1.5 0 01-1.49-1.457L9 7.5zm2.25 3.75a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm4.5 0a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Loading indicator for infinite scroll */}
                                {loadingMore && (
                                    <div className="px-6 py-4 text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="mt-2 text-sm text-gray-600">
                                            Loading activities...
                                        </p>
                                    </div>
                                )}

                                {/* Observer element for infinite scroll */}
                                <div ref={observerRef} className="h-0"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
