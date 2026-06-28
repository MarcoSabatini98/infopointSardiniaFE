import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { LoginPayload, LoginResponse } from '../models/auth.models';
import { SessionService } from './session.service';

// withCredentials: il refresh token viaggia come cookie httpOnly, quindi le
// chiamate auth devono includere i cookie.
const WITH_CREDENTIALS = { withCredentials: true };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionService);
  private readonly base = `${environment.apiBase}/auth`;

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.base}/login`, payload, WITH_CREDENTIALS)
      .pipe(
        map((r) => r.data),
        tap((d) => this.session.setSession(d.accessToken, d.user)),
      );
  }

  // Rinnova l'access token usando il refresh cookie. Ritorna il nuovo token.
  refresh(): Observable<string> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.base}/refresh`, {}, WITH_CREDENTIALS)
      .pipe(
        map((r) => r.data),
        tap((d) => this.session.setSession(d.accessToken, d.user)),
        map((d) => d.accessToken),
      );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.base}/logout`, {}, WITH_CREDENTIALS).pipe(
      tap({
        next: () => this.session.clear(),
        error: () => this.session.clear(),
      }),
    );
  }
}
