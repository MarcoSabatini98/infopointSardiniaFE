import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Header } from './header';

describe('Header', () => {
  beforeEach(() => localStorage.clear());

  it('mostra Accedi quando non autenticato', async () => {
    await render(Header, {
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    expect(screen.getByRole('link', { name: /accedi/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /esci/i })).toBeNull();
  });
});
