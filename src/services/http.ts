const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fieldErrors: FieldError[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  token?: string;
}

interface ErrorBody {
  message?: string;
  errors?: FieldError[];
}

async function readErrorBody(response: Response): Promise<ErrorBody> {
  try {
    return (await response.json()) as ErrorBody;
  } catch {
    return {};
  }
}

export async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con la API');
  }
  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new ApiError(
      response.status,
      body.message ?? `Error ${response.status} al llamar a ${path}`,
      body.errors ?? [],
    );
  }
  return (await response.json()) as T;
}

export function getJson<T>(path: string): Promise<T> {
  return requestJson<T>(path);
}
