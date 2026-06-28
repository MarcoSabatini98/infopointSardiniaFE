import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FeedsService } from './feeds.service';
import { environment } from '../../../environments/environment';

describe('FeedsService', () => {
  let service: FeedsService;
  let httpMock: HttpTestingController;
  const base = environment.apiBase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeedsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FeedsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('weather senza provincia chiama /weather', () => {
    service.weather().subscribe();
    const req = httpMock.expectOne(`${base}/weather`);
    expect(req.request.params.has('provincia')).toBe(false);
    req.flush({ status: 'success', success: true, data: [] });
  });

  it('weather con provincia aggiunge il param', () => {
    service.weather('SS').subscribe();
    const req = httpMock.expectOne((r) => r.url === `${base}/weather`);
    expect(req.request.params.get('provincia')).toBe('SS');
    req.flush({ status: 'success', success: true, data: {} });
  });

  it('news passa il limit e srotola data', () => {
    let res: { count?: number } | undefined;
    service.news(10).subscribe((r) => (res = r));
    const req = httpMock.expectOne((r) => r.url === `${base}/news`);
    expect(req.request.params.get('limit')).toBe('10');
    req.flush({ status: 'success', success: true, data: { count: 3, items: [] } });
    expect(res?.count).toBe(3);
  });

  it('traffic chiama /traffic', () => {
    service.traffic().subscribe();
    httpMock
      .expectOne(`${base}/traffic`)
      .flush({ status: 'success', success: true, data: { available: true } });
  });
});
