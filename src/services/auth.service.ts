import { requestJson } from './http';
import type { AuthResponse, LoginInput, RegisterInput } from '../types/auth';

export function register(input: RegisterInput): Promise<AuthResponse> {
  return requestJson<AuthResponse>('/users', { method: 'POST', body: input });
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return requestJson<AuthResponse>('/login', { method: 'POST', body: input });
}
