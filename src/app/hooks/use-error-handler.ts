'use client';

import { useCallback } from 'react';

type ErrorHandler = (error: Error, errorInfo?: unknown) => void;

interface UseErrorHandlerReturn {
  handleError: ErrorHandler;
  logError: (message: string, error?: Error) => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const handleError = useCallback<ErrorHandler>(
    (error: Error, errorInfo?: unknown) => {
      console.error('Error caught by useErrorHandler:', {
        message: error.message,
        stack: error.stack,
        errorInfo,
        timestamp: new Date().toISOString(),
        userAgent:
          typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
        url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      });

      // In production, you would send this to an error reporting service
      if (
        typeof window !== 'undefined' &&
        process.env.NODE_ENV === 'production'
      ) {
        // Example: sendErrorToAnalytics(error, errorInfo);
      }
    },
    []
  );

  const logError = useCallback((message: string, error?: Error) => {
    const logData = {
      level: 'error',
      message,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : null,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
    };

    console.error('Custom error log:', logData);
  }, []);

  return { handleError, logError };
};
