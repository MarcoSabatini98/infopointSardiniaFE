import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let session: SessionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService, SessionService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    session = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('login salva la sessione con il token ricevuto', () => {
    service.login({ email: 'a@b.it', password: 'x' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiBase}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush({
      status: 'success',
      success: true,
      data: {
        message: 'ok',
        accessToken: 'jwt',
        user: { uuid: 'u1', nome: 'Admin', email: 'a@b.it', role: 'admin' },
      },
    });
    expect(session.accessToken).toBe('jwt');
    expect(session.isAuthenticated()).toBe(true);
  });

  it('logout pulisce la sessione', () => {
    session.setSession('jwt', { uuid: 'u1', nome: 'A', email: 'a@b.it', role: 'admin' });
    service.logout().subscribe();
    httpMock.expectOne(`${environment.apiBase}/auth/logout`).flush({});
    expect(session.isAuthenticated()).toBe(false);
  });
});
