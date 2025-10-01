// API service for admin dashboard
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

// Helper function to get auth headers
const getAuthHeaders = async () => {
    // Get the session from NextAuth
    const { getSession } = await import('next-auth/react');
    const session = await getSession();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Add Authorization header if we have an access token
    if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    return headers;
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'moderator' | 'admin';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    blogCount: number;
    videoCount: number;
    isAdmin: boolean;
    isModerator: boolean;
    isBlocked: boolean;
    isVerifiedPoster: boolean;
}

export interface UserStats {
    totalUsers: number;
    activeUsers: number;
    newUsersThisPeriod: number;
    usersByRole: { role: string; count: number }[];
}

export interface BlogStats {
    totalBlogs: number;
    blogsThisPeriod: number;
    averageBlogsPerUser: number;
    topAuthors: { id: string; name: string; blogCount: number }[];
}

export interface PaginatedUsers {
    users: User[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// API Functions
export const dashboardAPI = {
    // Get all users with pagination and filters
    async getUsers(params: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        isActive?: string;
    } = {}): Promise<PaginatedUsers> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.role) queryParams.append('role', params.role);
        if (params.isActive) queryParams.append('isActive', params.isActive);

        const response = await fetch(`${API_BASE_URL}/api/users?${queryParams}`, {
            headers: await getAuthHeaders(),
        });

        const result = await handleResponse(response);
        return result.data;
    },

    // Get user statistics
    async getUserStatistics(period: string = '7d'): Promise<UserStats> {
        const response = await fetch(`${API_BASE_URL}/api/users/statistics/users?period=${period}`, {
            headers: await getAuthHeaders(),
        });

        const result = await handleResponse(response);
        return result.data;
    },

    // Get blog statistics
    async getBlogStatistics(period: string = '7d'): Promise<BlogStats> {
        const response = await fetch(`${API_BASE_URL}/api/users/statistics/blogs?period=${period}`, {
            headers: await getAuthHeaders(),
        });

        const result = await handleResponse(response);
        return result.data;
    },

    // Create a new user
    async createUser(userData: {
        name: string;
        email: string;
        password: string;
        isAdmin?: boolean;
        isModerator?: boolean;
        isVerifiedPoster?: boolean;
    }): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(userData),
        });

        const result = await handleResponse(response);
        return result.data;
    },

    // Update a user
    async updateUser(userId: string, userData: {
        name?: string;
        email?: string;
        isAdmin?: boolean;
        isModerator?: boolean;
        isBlocked?: boolean;
        isVerifiedPoster?: boolean;
    }): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: await getAuthHeaders(),
            body: JSON.stringify(userData),
        });

        const result = await handleResponse(response);
        return result.data;
    },

    // Delete a user
    async deleteUser(userId: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'DELETE',
            headers: await getAuthHeaders(),
        });

        await handleResponse(response);
    },

    // Toggle user status (block/unblock)
    async toggleUserStatus(userId: string): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/toggle-status`, {
            method: 'PATCH',
            headers: await getAuthHeaders(),
        });

        const result = await handleResponse(response);
        return result.data;
    },

    // Get a single user
    async getUser(userId: string): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            headers: await getAuthHeaders(),
        });

        const result = await handleResponse(response);
        return result.data;
    },
};