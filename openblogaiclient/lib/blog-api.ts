// API utilities for blog creation workflow

interface ApiResponse<T = unknown> {
    success?: boolean;
    data?: T;
    error?: boolean;
    message?: string;
}

interface Blog {
    id: number;
    subject: string;
    content: string;
    visible: number;
    userId: string;
    videoId?: number;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    video?: {
        id: number;
        title: string;
        url: string;
        uploadedAt: string;
    };
}

interface BlogUpdateData {
    subject?: string;
    content?: string;
    visible?: number;
}

interface TranscriptResponse {
    message: string;
    video: {
        id: number;
        url: string;
        title: string;
        userId: string;
        uploadedAt: string;
    };
    transcript: {
        id: number;
        content: string;
        videoId: number;
        createdAt: string;
    };
}

interface BlogGenerationResponse {
    success: boolean;
    blog: string;
}

class BlogCreationAPI {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8082';
    }

    private getAuthHeaders(accessToken?: string): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }

        const data = await response.json();
        return data;
    }

    /**
     * Extract transcript from YouTube video
     */
    async extractTranscript(videoId: string, userId: string, accessToken: string): Promise<TranscriptResponse> {
        const response = await fetch(`${this.baseUrl}/api/transcript/${videoId}`, {
            method: 'POST',
            headers: this.getAuthHeaders(accessToken),
            body: JSON.stringify({ userId })
        });

        return this.handleResponse<TranscriptResponse>(response);
    }

    /**
     * Generate blog from transcript using AI
     */
    async generateBlog(
        modelId: string,
        transcript: string,
        userId: string,
        accessToken: string
    ): Promise<BlogGenerationResponse> {
        const response = await fetch(`${this.baseUrl}/api/blog/generate-blog`, {
            method: 'POST',
            headers: this.getAuthHeaders(accessToken),
            body: JSON.stringify({
                modelId,
                transcript,
                uid: userId
            })
        });

        return this.handleResponse<BlogGenerationResponse>(response);
    }

    /**
     * Get all blogs
     */
    async getBlogs(accessToken: string): Promise<Blog[]> {
        const response = await fetch(`${this.baseUrl}/api/blog/blogs`, {
            method: 'GET',
            headers: this.getAuthHeaders(accessToken)
        });

        return this.handleResponse<Blog[]>(response);
    }

    /**
     * Get single blog by ID
     */
    async getBlog(id: number, accessToken?: string): Promise<Blog> {
        const response = await fetch(`${this.baseUrl}/api/blog/blogs/${id}`, {
            method: 'GET',
            headers: this.getAuthHeaders(accessToken)
        });

        return this.handleResponse<Blog>(response);
    }

    /**
     * Update blog
     */
    async updateBlog(
        id: number,
        data: BlogUpdateData,
        accessToken: string
    ): Promise<Blog> {
        const response = await fetch(`${this.baseUrl}/api/blog/blogs/${id}`, {
            method: 'PATCH',
            headers: this.getAuthHeaders(accessToken),
            body: JSON.stringify(data)
        });

        return this.handleResponse<Blog>(response);
    }

    /**
     * Delete blog
     */
    async deleteBlog(id: number, accessToken: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/api/blog/blogs/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(accessToken)
        });

        if (!response.ok) {
            throw new Error(`Failed to delete blog: ${response.statusText}`);
        }
    }
}

// Export singleton instance
export const blogAPI = new BlogCreationAPI();

// Export types for use in components
export type {
    ApiResponse,
    TranscriptResponse,
    BlogGenerationResponse,
    Blog,
    BlogUpdateData
};