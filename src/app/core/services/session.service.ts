import { Injectable, computed, signal } from '@angular/core';
import { AuthUser } from '../models/auth.models';

const TOKEN_KEY = 'infopoint.accessToken';
const USER_KEY = 'infopoint.user';

// Stato di sessione lato client. L'access token vive qui (memoria + localStorage
// per sopravvivere al refresh pagina); il refresh token è in un cookie httpOnly
// gestito dal browser, quindi NON è accessibile/da gestire qui.
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly _accessToken = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly _user = signal<AuthUser | null>(readUser());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._accessToken() !== null);

  get accessToken(): string | null {
    return this._accessToken();
  }

  setSession(accessToken: string, user: AuthUser): void {
    this._accessToken.set(accessToken);
    this._user.set(user);
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clear(): void {
    this._accessToken.set(null);
    this._user.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

function readUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
