export interface AuthUser {
  id: number;
  username: string;
  email: string;
  terms: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface Session {
  token: string;
  user: AuthUser;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  terms: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}
