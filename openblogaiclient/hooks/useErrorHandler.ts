"use client";

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ApiError } from '../lib/error-utils';

export const useErrorHandler = () => {
    const router = useRouter();

    const handleError = useCallback((error: ApiError | Error) => {
        console.error('Error occurred:', error);

        // Check if it's an API error with response status
        if ('response' in error && error.response?.status) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    router.push('/401');
                    break;
                case 404:
                    router.push('/404');
                    break;
                case 500:
                case 502:
                case 503:
                case 504:
                    router.push('/500');
                    break;
                default:
                    // For other errors, show a generic error
                    router.push('/500');
                    break;
            }
        } else {
            // For non-API errors, show generic error
            router.push('/500');
        }
    }, [router]);

    const handleApiError = useCallback((error: ApiError) => {
        handleError(error);
    }, [handleError]);

    const handleUnauthorized = useCallback(() => {
        router.push('/401');
    }, [router]);

    const handleNotFound = useCallback(() => {
        router.push('/404');
    }, [router]);

    const handleServerError = useCallback(() => {
        router.push('/500');
    }, [router]);

    return {
        handleError,
        handleApiError,
        handleUnauthorized,
        handleNotFound,
        handleServerError
    };
};