import { render, screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect } from 'vitest';
import { EventsList } from './events-list';
import { environment } from '../../../environments/environment';

describe('EventsList', () => {
  it('carica e mostra gli eventi dalla fonte esterna', async () => {
    await render(EventsList, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const httpMock = TestBed.inject(HttpTestingController);
    const req = httpMock.expectOne(`${environment.apiBase}/events/external`);
    req.flush({
      status: 'success',
      success: true,
      data: {
        available: true,
        count: 1,
        events: [
          {
            title: 'Monumenti Aperti',
            link: 'https://www.sardegnaturismo.it/it/eventi/monumenti-aperti',
            date: '18 Aprile - 08 Novembre',
            location: 'Diverse località',
            image: null,
            source: 'SardegnaTurismo',
          },
        ],
      },
    });
    expect(await screen.findByText(/monumenti aperti/i)).toBeTruthy();
    httpMock.verify();
  });
});
