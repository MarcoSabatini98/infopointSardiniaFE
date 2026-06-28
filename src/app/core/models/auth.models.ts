export interface AuthUser {
  uuid: string;
  nome: string;
  email: string;
  role: 'admin';
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}
