type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
    path: string;
    method?: HttpMethod;
    query?: Record<string, string | number | boolean | null | undefined>;
    body?: unknown;
    headers?: HeadersInit;
    signal?: AbortSignal;
}

// Base URL is configured via env, with a localhost fallback for development.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function buildUrl(
    path: string,
    query?: Record<string, string | number | boolean | null | undefined>,
): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(normalizedPath, API_BASE_URL);

    if (!query) {
        return url.toString();
    }

    // Skip empty query values to avoid noisy URLs.
    Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
            return;
        }
        url.searchParams.set(key, String(value));
    });

    return url.toString();
}

async function parseResponseBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) {
        return null;
    }

    try {
        // Parse JSON when possible, otherwise return plain text payload.
        return JSON.parse(text) as unknown;
    } catch {
        return text;
    }
}

function extractErrorMessage(body: unknown): string | null {
    if (typeof body === "string" && body.trim().length > 0) {
        return body;
    }

    if (isRecord(body)) {
        const message = body.message;
        if (typeof message === "string" && message.trim().length > 0) {
            return message;
        }

        const error = body.error;
        if (typeof error === "string" && error.trim().length > 0) {
            return error;
        }
    }

    return null;
}

export async function apiRequest<T>(options: ApiRequestOptions): Promise<T> {
    const { path, method = "GET", query, body, headers, signal } = options;

    const requestHeaders: HeadersInit =
        body === undefined
            ? (headers ?? {})
            : {
                "Content-Type": "application/json",
                ...(headers ?? {}),
            };

    const response = await fetch(buildUrl(path, query), {
        method,
        headers: requestHeaders,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal,
        // Keep cookies/session support for authenticated backends.
        credentials: "include",
    });

    const parsedBody = await parseResponseBody(response);

    if (!response.ok) {
        const message =
            extractErrorMessage(parsedBody) ?? `Request failed with status ${response.status}`;
        throw new ApiError(message, response.status);
    }

    return parsedBody as T;
}
