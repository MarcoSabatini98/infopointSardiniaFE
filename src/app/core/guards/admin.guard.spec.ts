import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { adminGuard } from './admin.guard';
import { SessionService } from '../services/session.service';

function runGuard(authenticated: boolean) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: SessionService, useValue: { isAuthenticated: () => authenticated } },
    ],
  });
  const route = {} as ActivatedRouteSnapshot;
  const state = { url: '/gestione' } as RouterStateSnapshot;
  return TestBed.runInInjectionContext(() => adminGuard(route, state));
}

describe('adminGuard', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('consente l accesso se autenticato', () => {
    expect(runGuard(true)).toBe(true);
  });

  it('reindirizza al login se non autenticato', () => {
    const result = runGuard(false);
    expect(result instanceof UrlTree).toBe(true);
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(result as UrlTree)).toContain('/login');
  });
});
