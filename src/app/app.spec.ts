import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App (shell)', () => {
  it('renderizza header e router-outlet', async () => {
    await render(App, {
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });

    // Brand nell'header
    expect(screen.getByText(/infopoint/i)).toBeTruthy();
    // Link di navigazione
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /eventi/i })).toBeTruthy();
  });
});
