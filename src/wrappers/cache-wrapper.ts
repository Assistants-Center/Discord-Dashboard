import axios, { AxiosError, AxiosResponse } from 'axios';
import errors from 'throw-http-errors';
import ErrorCodes from '@discord-dashboard/typings/dist/Core/ErrorCodes';

interface RateLimitData {
    limit: number;
    remaining: number;
    reset: number;
    resetAfter: number;
    bucket: string;
    global?: boolean;
    scope?: string;
}

interface CacheEntry {
    data: any;
    expiresAt: number;
    rateLimit: RateLimitData;
}

const cache: Map<string, CacheEntry> = new Map();

const fetchWithCache = async <T>(
    url: string,
    headers: Record<string, string>,
): Promise<T> => {
    const cacheEntry = cache.get(url);

    // Sprawdzenie czy dane są w cache i są jeszcze ważne
    if (cacheEntry && Date.now() < cacheEntry.expiresAt) {
        return cacheEntry.data;
    }

    try {
        const response: AxiosResponse<T> = await axios.get<T>(url, { headers });

        const rateLimitData: RateLimitData = {
            limit: parseInt(response.headers['x-ratelimit-limit'], 10),
            remaining: parseInt(response.headers['x-ratelimit-remaining'], 10),
            reset: parseInt(response.headers['x-ratelimit-reset'], 10),
            resetAfter: parseFloat(response.headers['x-ratelimit-reset-after']),
            bucket: response.headers['x-ratelimit-bucket'],
            global: response.headers['x-ratelimit-global'] === 'true',
            scope: response.headers['x-ratelimit-scope'],
        };

        // Obliczanie czasu wygaśnięcia w zależności od limitu resetu plus dodatkowa minuta
        const expiresAt = Date.now() + rateLimitData.resetAfter * 1000 + 60000;

        cache.set(url, {
            data: response.data,
            expiresAt,
            rateLimit: rateLimitData,
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 429) {
                // W przypadku limitu szybkości, możemy chcieć zareagować odpowiednio
                // Możesz także dodać logikę do przechowywania informacji o ratelimit w pamięci
                throw new errors.TooManyRequests(
                    'Rate limit exceeded. Please try again later.',
                    ErrorCodes.TOO_MANY_REQUESTS,
                );
            } else {
                throw new errors.InternalServerError(
                    error.message,
                    ErrorCodes.INTERNAL_SERVER_ERROR,
                );
            }
        } else if (error instanceof Error) {
            throw new errors.InternalServerError(
                error.message,
                ErrorCodes.INTERNAL_SERVER_ERROR,
            );
        } else {
            throw new errors.InternalServerError(
                'An unknown error occurred',
                ErrorCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
};

export default fetchWithCache;
