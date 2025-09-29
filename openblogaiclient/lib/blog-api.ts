// API utilities for blog creation workflow

interface ApiResponse<T = any> {
    success?: boolean;
    data?: T;
    error?: boolean;
    message?: string;
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
        const response = await fetch(`${this.baseUrl}/transcript/${videoId}`, {
            method: 'POST', // Changed to POST to send body data
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
        const response = await fetch(`${this.baseUrl}/blog/generate-blog`, {
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
    async getBlogs(accessToken: string): Promise<any[]> {
        const response = await fetch(`${this.baseUrl}/blog/blogs`, {
            method: 'GET',
            headers: this.getAuthHeaders(accessToken)
        });

        return this.handleResponse<any[]>(response);
    }

    /**
     * Get single blog by ID
     */
    async getBlog(id: number, accessToken?: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/blog/blogs/${id}`, {
            method: 'GET',
            headers: this.getAuthHeaders(accessToken)
        });

        return this.handleResponse<any>(response);
    }

    /**
     * Update blog
     */
    async updateBlog(
        id: number,
        data: { subject?: string; content?: string; visible?: number },
        accessToken: string
    ): Promise<any> {
        const response = await fetch(`${this.baseUrl}/blog/blogs/${id}`, {
            method: 'PATCH',
            headers: this.getAuthHeaders(accessToken),
            body: JSON.stringify(data)
        });

        return this.handleResponse<any>(response);
    }

    /**
     * Delete blog
     */
    async deleteBlog(id: number, accessToken: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/blog/blogs/${id}`, {
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
    BlogGenerationResponse
};