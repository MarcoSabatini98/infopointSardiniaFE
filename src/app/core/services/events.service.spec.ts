import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EventsService } from './events.service';
import { environment } from '../../../environments/environment';

describe('EventsService', () => {
  let service: EventsService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiBase}/events`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EventsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('list applica i filtri come query params e scarta i vuoti', () => {
    service.list({ status: 'pubblicato', province_code: 'CA', q: '' }).subscribe();
    const req = httpMock.expectOne(
      (r) => r.url === base && r.params.get('status') === 'pubblicato',
    );
    expect(req.request.params.get('province_code')).toBe('CA');
    expect(req.request.params.has('q')).toBe(false);
    req.flush({ status: 'success', success: true, data: { data: [], pagination: {} } });
  });

  it('create fa POST e srotola data', () => {
    let result: { uuid?: string } | undefined;
    service.create({ title: 'X' }).subscribe((r) => (result = r));
    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'success', success: true, data: { uuid: 'e1', title: 'X' } });
    expect(result?.uuid).toBe('e1');
  });

  it('remove fa DELETE sull URL con uuid', () => {
    service.remove('e1').subscribe();
    const req = httpMock.expectOne(`${base}/e1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
