import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { MapLayer, Province, ProvinceCode } from '../models/province.models';

// Risposta aggregata del click-provincia (BE /map/provinces/:code).
export interface ProvinceInfo {
  province: Province;
  weather: unknown;
  fires: { count: number; items: unknown[] };
  alerts: { count: number; items: unknown[] };
  events: { count: number; items: unknown[] };
}

@Injectable({ providedIn: 'root' })
export class MapService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBase}/map`;

  provinces(): Observable<Province[]> {
    return this.http
      .get<ApiResponse<Province[]>>(`${this.base}/provinces`)
      .pipe(map((r) => r.data));
  }

  // GeoJSON servito raw (non JSend) dal BE.
  geojson(): Observable<GeoJSON.FeatureCollection> {
    return this.http.get<GeoJSON.FeatureCollection>(`${this.base}/provinces/geojson`);
  }

  provinceInfo(code: ProvinceCode): Observable<ProvinceInfo> {
    return this.http
      .get<ApiResponse<ProvinceInfo>>(`${this.base}/provinces/${code}`)
      .pipe(map((r) => r.data));
  }

  layer<T = unknown>(layer: MapLayer): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.base}/layers/${layer}`)
      .pipe(map((r) => r.data));
  }
}
