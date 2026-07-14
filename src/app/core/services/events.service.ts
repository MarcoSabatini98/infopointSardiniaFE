import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Paginated } from '../models/api.models';
import { EventFilters, EventItem, ExternalEvent } from '../models/event.models';

interface ExternalEventsResponse {
  available: boolean;
  count: number;
  events: ExternalEvent[];
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBase}/events`;

  list(filters: EventFilters = {}): Observable<Paginated<EventItem>> {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    }
    return this.http
      .get<ApiResponse<Paginated<EventItem>>>(this.base, { params })
      .pipe(map((r) => r.data));
  }

  // Eventi dalla fonte ufficiale esterna (SardegnaTurismo).
  externalList(): Observable<ExternalEvent[]> {
    return this.http
      .get<ApiResponse<ExternalEventsResponse>>(`${this.base}/external`)
      .pipe(map((r) => r.data.events));
  }

  get(uuid: string): Observable<EventItem> {
    return this.http.get<ApiResponse<EventItem>>(`${this.base}/${uuid}`).pipe(map((r) => r.data));
  }

  create(payload: Partial<EventItem>): Observable<EventItem> {
    return this.http.post<ApiResponse<EventItem>>(this.base, payload).pipe(map((r) => r.data));
  }

  update(uuid: string, payload: Partial<EventItem>): Observable<EventItem> {
    return this.http
      .patch<ApiResponse<EventItem>>(`${this.base}/${uuid}`, payload)
      .pipe(map((r) => r.data));
  }

  remove(uuid: string): Observable<unknown> {
    return this.http.delete(`${this.base}/${uuid}`);
  }
}
