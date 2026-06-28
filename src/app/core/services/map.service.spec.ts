import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MapService } from './map.service';
import { environment } from '../../../environments/environment';

describe('MapService', () => {
  let service: MapService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiBase}/map`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MapService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('geojson legge la risposta raw (non JSend)', () => {
    let res: unknown;
    service.geojson().subscribe((r) => (res = r));
    const fc = { type: 'FeatureCollection', features: [] };
    httpMock.expectOne(`${base}/provinces/geojson`).flush(fc);
    expect(res).toEqual(fc);
  });

  it('provinceInfo srotola i dati aggregati', () => {
    let res: { province?: unknown } | undefined;
    service.provinceInfo('CA').subscribe((r) => (res = r));
    httpMock
      .expectOne(`${base}/provinces/CA`)
      .flush({ status: 'success', success: true, data: { province: { code: 'CA' } } });
    expect(res?.province).toEqual({ code: 'CA' });
  });

  it('layer compone l URL del layer richiesto', () => {
    service.layer('fires').subscribe();
    const req = httpMock.expectOne(`${base}/layers/fires`);
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'success', success: true, data: {} });
  });
});
