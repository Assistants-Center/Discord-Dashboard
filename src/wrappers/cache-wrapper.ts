import axios, { AxiosError, AxiosResponse } from 'axios';

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

    if (cacheEntry && Date.now() < cacheEntry.expiresAt) {
        // If cache is still valid, return cached data
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

        // Calculate expiration time based on rate limit reset
        const expiresAt = Date.now() + rateLimitData.resetAfter * 1000;

        cache.set(url, {
            data: response.data,
            expiresAt,
            rateLimit: rateLimitData,
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 429) {
                // If rate limited, throw an appropriate error
                throw new Error('Rate limit exceeded. Please try again later.');
            } else {
                throw new Error(
                    `Request failed with status ${error.response?.status}: ${error.message}`,
                );
            }
        } else if (error instanceof Error) {
            // If the error is a generic Error
            throw new Error(error.message);
        } else {
            // If the error is something else, rethrow it
            throw new Error('An unknown error occurred');
        }
    }
};

export default fetchWithCache;
