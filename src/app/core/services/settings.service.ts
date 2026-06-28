import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';

export interface Setting {
  key: string;
  value: unknown;
  description: string | null;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBase}/settings`;

  list(): Observable<Setting[]> {
    return this.http.get<ApiResponse<Setting[]>>(this.base).pipe(map((r) => r.data));
  }

  get(key: string): Observable<Setting> {
    return this.http.get<ApiResponse<Setting>>(`${this.base}/${key}`).pipe(map((r) => r.data));
  }

  upsert(key: string, value: unknown, description?: string): Observable<Setting> {
    return this.http
      .put<ApiResponse<Setting>>(`${this.base}/${key}`, { value, description })
      .pipe(map((r) => r.data));
  }
}
