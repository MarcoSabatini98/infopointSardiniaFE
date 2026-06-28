import { render, screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect } from 'vitest';
import { EventsAdmin } from './events-admin';
import { environment } from '../../../environments/environment';

describe('EventsAdmin', () => {
  it('mostra la testata di gestione e carica la lista', async () => {
    await render(EventsAdmin, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock
      .expectOne((r) => r.url === `${environment.apiBase}/events`)
      .flush({ status: 'success', success: true, data: { data: [], pagination: {} } });

    expect(screen.getByRole('heading', { name: /gestione eventi/i })).toBeTruthy();
    httpMock.verify();
  });
});
