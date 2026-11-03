const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function getJson<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`);
  } catch {
    throw new ApiError(0, 'No se pudo conectar con la API');
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Error ${response.status} al llamar a ${path}`);
  }
  return (await response.json()) as T;
}
