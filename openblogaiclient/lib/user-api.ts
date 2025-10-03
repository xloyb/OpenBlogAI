interface UserProfile {
    user: {
        id: string;
        name: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        role: 'user' | 'moderator' | 'admin';
        isVerifiedPoster: boolean;
        isBlocked: boolean;
        isActive: boolean;
    };
    statistics: {
        totalBlogs: number;
        totalVideos: number;
        recentBlogs: number;
        recentVideos: number;
        weeklyBlogs: number;
        weeklyVideos: number;
        totalBlogViews: number;
        accountAge: number;
    };
    achievements: Array<{
        name: string;
        icon: string;
        description: string;
    }>;
}

interface UserActivity {
    id: string;
    type: 'blog_created' | 'video_uploaded';
    title: string;
    createdAt: string;
    icon: string;
    description: string;
}

// Remove unused interface - already exists in other API files

class UserAPI {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';
    }

    private getAuthHeaders(accessToken?: string): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.data || data;
    }

    /**
     * Get current user's profile with statistics
     */
    async getUserProfile(accessToken: string): Promise<UserProfile> {
        const response = await fetch(`${this.baseUrl}/api/users/profile`, {
            method: 'GET',
            headers: this.getAuthHeaders(accessToken)
        });

        return this.handleResponse<UserProfile>(response);
    }

    /**
     * Get current user's recent activity
     */
    async getUserActivity(accessToken: string, limit: number = 20): Promise<UserActivity[]> {
        const response = await fetch(`${this.baseUrl}/api/users/activity?limit=${limit}`, {
            method: 'GET',
            headers: this.getAuthHeaders(accessToken)
        });

        return this.handleResponse<UserActivity[]>(response);
    }
}

export const userAPI = new UserAPI();
export type { UserProfile, UserActivity };