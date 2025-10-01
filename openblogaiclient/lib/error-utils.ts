// Error handling utilities for redirecting to error pages

export const redirectToErrorPage = (errorCode: 401 | 404 | 500) => {
    if (typeof window !== 'undefined') {
        window.location.href = `/${errorCode}`;
    }
};

export const handleApiError = (error: ApiError) => {
    if (error.response) {
        const status = error.response.status;
        switch (status) {
            case 401:
                redirectToErrorPage(401);
                break;
            case 404:
                redirectToErrorPage(404);
                break;
            case 500:
            case 502:
            case 503:
            case 504:
                redirectToErrorPage(500);
                break;
            default:
                console.error('API Error:', error);
                break;
        }
    } else if (error.request) {
        // Network error
        redirectToErrorPage(500);
    } else {
        console.error('Error:', error.message);
    }
};

export const isUnauthorized = (error: ApiError): boolean => {
    return error.response?.status === 401;
};

export const isNotFound = (error: ApiError): boolean => {
    return error.response?.status === 404;
};

export const isServerError = (error: ApiError): boolean => {
    const status = error.response?.status;
    return status ? status >= 500 && status < 600 : false;
};

// Custom error classes
export class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized access') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
    }
}

export class ServerError extends Error {
    constructor(message = 'Internal server error') {
        super(message);
        this.name = 'ServerError';
    }
}

// Type definitions for error handling
export type ErrorCode = 401 | 404 | 500;

export interface ApiError {
    response?: {
        status: number;
        data?: unknown;
    };
    request?: unknown;
    message: string;
}