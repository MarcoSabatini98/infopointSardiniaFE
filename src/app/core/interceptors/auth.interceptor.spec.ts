import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { authInterceptor } from './auth.interceptor';
import { SessionService } from '../services/session.service';
import { environment } from '../../../environments/environment';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let session: SessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        SessionService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionService);
  });

  afterEach(() => httpMock.verify());

  it('aggiunge il Bearer token alle chiamate API', () => {
    session.setSession('jwt', { uuid: 'u', nome: 'A', email: 'a@b.it', role: 'admin' });
    http.get(`${environment.apiBase}/events`).subscribe();
    const req = httpMock.expectOne(`${environment.apiBase}/events`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('non tocca le richieste fuori dall API', () => {
    http.get('https://altro.example.com/x').subscribe();
    const req = httpMock.expectOne('https://altro.example.com/x');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
