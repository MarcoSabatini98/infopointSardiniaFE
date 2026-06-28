import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SessionService } from './session.service';
import { AuthUser } from '../models/auth.models';

const user: AuthUser = { uuid: 'u1', nome: 'Admin', email: 'a@b.it', role: 'admin' };

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [SessionService] });
    service = TestBed.inject(SessionService);
  });

  it('parte non autenticato', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.accessToken).toBeNull();
  });

  it('setSession salva token e utente e persiste', () => {
    service.setSession('tok', user);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.accessToken).toBe('tok');
    expect(service.user()?.email).toBe('a@b.it');
    expect(localStorage.getItem('infopoint.accessToken')).toBe('tok');
  });

  it('clear azzera sessione e storage', () => {
    service.setSession('tok', user);
    service.clear();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('infopoint.accessToken')).toBeNull();
  });
});
