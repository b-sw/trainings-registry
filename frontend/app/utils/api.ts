import axios from 'axios';
import { config } from '../config/env';

// Backend interfaces
export interface TrainingSerialized {
    id: string;
    userId: string;
    description: string;
    date: Date;
    distance: number;
    activityType: 'cycling' | 'running' | 'walking';
    createdAt: Date;
    updatedAt: Date;
}

export interface UserSerialized {
    id: string;
    email: string;
    name: string;
    role: 'Admin' | 'Employee';
    createdAt: Date;
    updatedAt: Date;
}

export interface UserActivity {
    userId: string;
    totalDistance: number;
    totalTrainings: number;
}

export interface UserActivityDetailed {
    userId: string;
    totalDistance: number;
    totalTrainings: number;
    trainings: TrainingSerialized[];
}

export interface TeamActivity {
    totalDistance: number;
    totalTrainings: number;
    totalUsers: number;
}

// Frontend interfaces (mapping from backend)
export interface Activity {
    id: string;
    type: 'cycling' | 'running' | 'walking';
    distance: number;
    duration: number; // estimated from distance
    date: string;
    notes?: string;
}

// API client setup
const apiClient = axios.create({
    baseURL: config.BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
});

// Response interceptor to handle 401 unauthorized
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear user data from localStorage
            localStorage.removeItem('user');

            // Redirect to landing page
            window.location.href = '/';
        }
        return Promise.reject(error);
    },
);

// Training API endpoints
export const trainingApi = {
    // Get all trainings
    getAll: async (): Promise<TrainingSerialized[]> => {
        const response = await apiClient.get('/trainings');
        return response.data;
    },

    // Get training by ID
    getById: async (trainingId: string): Promise<TrainingSerialized> => {
        const response = await apiClient.get(`/trainings/${trainingId}`);
        return response.data;
    },

    // Get user trainings
    getUserTrainings: async (userId: string): Promise<TrainingSerialized[]> => {
        const response = await apiClient.get(`/users/${userId}/trainings`);
        return response.data;
    },

    // Get user trainings with pagination
    getUserTrainingsPaginated: async (
        userId: string,
        skip: number = 0,
        limit: number = 20,
    ): Promise<{
        trainings: TrainingSerialized[];
        total: number;
        hasMore: boolean;
        skip: number;
        limit: number;
    }> => {
        const response = await apiClient.get(
            `/users/${userId}/trainings?skip=${skip}&limit=${limit}`,
        );
        return response.data;
    },

    // Get user activities in date range
    getUserActivities: async (
        userId: string,
        startDate: string,
        endDate: string,
    ): Promise<UserActivityDetailed> => {
        const response = await apiClient.post(`/users/${userId}/activities`, {
            startDate,
            endDate,
        });
        return response.data;
    },

    // Get all users activities in date range
    getAllUsersActivities: async (startDate: string, endDate: string): Promise<UserActivity[]> => {
        const response = await apiClient.post('/users/activities', {
            startDate,
            endDate,
        });
        return response.data;
    },

    // Get team activities summary
    getTeamActivities: async (startDate: string, endDate: string): Promise<TeamActivity> => {
        const response = await apiClient.post('/teams/activities', {
            startDate,
            endDate,
        });
        return response.data;
    },

    // Get total distance across all trainings
    getTotalDistance: async (): Promise<{ totalDistance: number }> => {
        const response = await apiClient.get('/trainings/total-distance');
        return response.data;
    },

    // Create training
    create: async (training: {
        userId: string;
        description?: string;
        distance: number;
        date: string;
        activityType: 'cycling' | 'running' | 'walking';
    }): Promise<TrainingSerialized> => {
        const response = await apiClient.post('/trainings', training);
        return response.data;
    },

    // Update training
    update: async (
        trainingId: string,
        training: Partial<{
            description: string;
            distance: number;
            date: string;
            activityType: 'cycling' | 'running' | 'walking';
        }>,
    ): Promise<TrainingSerialized> => {
        const response = await apiClient.put(`/trainings/${trainingId}`, training);
        return response.data;
    },

    // Delete training
    delete: async (trainingId: string): Promise<TrainingSerialized> => {
        const response = await apiClient.delete(`/trainings/${trainingId}`);
        return response.data;
    },
};

// User API endpoints
export const userApi = {
    // Get all users
    getAll: async (): Promise<UserSerialized[]> => {
        const response = await apiClient.get('/users');
        return response.data;
    },

    // Get user by ID
    getById: async (userId: string): Promise<UserSerialized> => {
        const response = await apiClient.get(`/users/${userId}`);
        return response.data;
    },

    // Get all admins
    getAdmins: async (): Promise<UserSerialized[]> => {
        const response = await apiClient.get('/users/admins');
        return response.data;
    },

    // Get all employees
    getEmployees: async (): Promise<UserSerialized[]> => {
        const response = await apiClient.get('/users/employees');
        return response.data;
    },

    // Create user
    create: async (user: {
        email: string;
        name: string;
        role: 'Admin' | 'Employee';
    }): Promise<UserSerialized> => {
        const response = await apiClient.post('/users', user);
        return response.data;
    },

    // Update user
    update: async (
        userId: string,
        user: Partial<{
            email: string;
            name: string;
            role: 'Admin' | 'Employee';
        }>,
    ): Promise<UserSerialized> => {
        const response = await apiClient.put(`/users/${userId}`, user);
        return response.data;
    },

    // Delete user
    delete: async (userId: string): Promise<UserSerialized> => {
        const response = await apiClient.delete(`/users/${userId}`);
        return response.data;
    },
};

// Public API endpoints
export const publicApi = {
    // Get total kilometers completed publicly
    getTotalKilometers: async (): Promise<{ totalKilometers: number }> => {
        const response = await apiClient.get('/public/total-kilometers');
        return response.data;
    },
};

// Helper functions to map backend data to frontend format
export const mapTrainingToActivity = (training: TrainingSerialized): Activity => {
    const type: 'cycling' | 'running' | 'walking' = training.activityType;

    // Estimate duration based on distance and activity type (rough estimates)
    let estimatedDuration = 0;
    if (type === 'running') {
        estimatedDuration = Math.round(training.distance * 6);
    } else if (type === 'cycling') {
        estimatedDuration = Math.round(training.distance * 2.5);
    } else {
        estimatedDuration = Math.round(training.distance * 10);
    }

    return {
        id: training.id,
        type,
        distance: training.distance,
        duration: estimatedDuration,
        date: new Date(training.date).toISOString().split('T')[0],
        notes: training.description,
    };
};

export default { trainingApi, userApi, publicApi };
