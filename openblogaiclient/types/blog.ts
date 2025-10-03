// Common blog types for the application

export interface Blog {
    id: number;
    subject: string;
    content: string;
    visible: number;
    userId: string;
    videoId?: number;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    seoFaq?: string[];
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name?: string;
        email: string;
    };
    video?: {
        id: number;
        title: string;
        url: string;
        uploadedAt: string;
    };
}

export interface BlogUpdateData {
    subject?: string;
    content?: string;
    visible?: number;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    seoFaq?: string[];
}

export interface BlogsResponse {
    success: boolean;
    data: Blog[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    query: {
        page: number;
        limit: number;
        sortBy: string;
        sortOrder: string;
        search: string | null;
    };
}

export interface SEOFieldsFormData {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    seoFaq: string[];
}