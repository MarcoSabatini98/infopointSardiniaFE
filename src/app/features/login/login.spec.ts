import { render, screen } from '@testing-library/angular';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect } from 'vitest';
import { Login } from './login';

const routeMock = { snapshot: { queryParamMap: { get: () => null } } };

describe('Login', () => {
  it('renderizza il form di accesso', async () => {
    await render(Login, {
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    });
    expect(screen.getByRole('heading', { name: /accedi/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /accedi/i })).toBeTruthy();
  });
});
