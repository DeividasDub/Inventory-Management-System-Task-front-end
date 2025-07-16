export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  roles: string[];
  expiresAt: string;
}

export interface User {
  email: string;
  roles: string[];
}
