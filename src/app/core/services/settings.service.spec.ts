import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SettingsService } from './settings.service';
import { environment } from '../../../environments/environment';

describe('SettingsService', () => {
  let service: SettingsService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiBase}/settings`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SettingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('upsert fa PUT con value e description', () => {
    service.upsert('map.default_layer', 'weather', 'desc').subscribe();
    const req = httpMock.expectOne(`${base}/map.default_layer`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ value: 'weather', description: 'desc' });
    req.flush({ status: 'success', success: true, data: { key: 'map.default_layer' } });
  });
});
