import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';

// Aggiunge il bearer token alle chiamate verso l'API e include i cookie
// (refresh token httpOnly). Su 401 non-auth tenta una volta il refresh e ripete
// la richiesta; se fallisce, pulisce la sessione e reindirizza al login.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiBase)) return next(req);

  const session = inject(SessionService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuthCall = req.url.includes('/auth/');
  const authed = withAuth(req, session.accessToken);

  return next(authed).pipe(
    catchError((err) => {
      if (err.status !== 401 || isAuthCall || !session.isAuthenticated()) {
        return throwError(() => err);
      }
      return auth.refresh().pipe(
        switchMap((token) => next(withAuth(req, token))),
        catchError((refreshErr) => {
          session.clear();
          router.navigate(['/login']);
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};

// Clona la richiesta con Bearer token (se presente) e withCredentials sempre
// attivo verso l'API (serve per il refresh cookie).
function withAuth(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  return req.clone({
    withCredentials: true,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
