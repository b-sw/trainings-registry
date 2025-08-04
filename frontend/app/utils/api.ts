import axios from 'axios';
import { config } from '../config/env';

// Backend interfaces
export interface TrainingSerialized {
    id: string;
    userId: string;
    title: string;
    description: string;
    date: Date;
    distance: number;
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
    type: 'cycling' | 'running' | 'other';
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
        title: string;
        description: string;
        distance: number;
        date: string;
    }): Promise<TrainingSerialized> => {
        const response = await apiClient.post('/trainings', training);
        return response.data;
    },

    // Update training
    update: async (
        trainingId: string,
        training: Partial<{
            title: string;
            description: string;
            distance: number;
            date: string;
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

// Helper functions to map backend data to frontend format
export const mapTrainingToActivity = (training: TrainingSerialized): Activity => {
    // Determine activity type from title/description (simple heuristic)
    const title = training.title.toLowerCase();
    const description = training.description.toLowerCase();

    let type: 'cycling' | 'running' | 'other' = 'other';
    if (title.includes('run') || description.includes('run') || title.includes('jog')) {
        type = 'running';
    } else if (title.includes('cycl') || description.includes('bike') || title.includes('cycl')) {
        type = 'cycling';
    }

    // Estimate duration based on distance and activity type (rough estimates)
    let estimatedDuration = 0;
    if (type === 'running') {
        // Assume 6 minutes per km for running
        estimatedDuration = Math.round(training.distance * 6);
    } else if (type === 'cycling') {
        // Assume 2.5 minutes per km for cycling
        estimatedDuration = Math.round(training.distance * 2.5);
    } else {
        // Default estimate for other activities
        estimatedDuration = Math.round(training.distance * 4);
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

export default { trainingApi, userApi };
