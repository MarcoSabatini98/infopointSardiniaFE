import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { ProvinceCode } from '../models/province.models';
import {
  FiresResponse,
  FloodsResponse,
  FlightsResponse,
  NewsResponse,
  TrafficResponse,
  VesselsResponse,
  WeatherProvince,
} from '../models/feeds.models';

// Endpoint pubblici di aggregazione del backend (meteo + hazard + traffico).
@Injectable({ providedIn: 'root' })
export class FeedsService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBase;

  weather(provincia?: ProvinceCode): Observable<WeatherProvince | WeatherProvince[]> {
    const params = provincia ? new HttpParams().set('provincia', provincia) : undefined;
    return this.http
      .get<ApiResponse<WeatherProvince | WeatherProvince[]>>(`${this.base}/weather`, { params })
      .pipe(map((r) => r.data));
  }

  fires(): Observable<FiresResponse> {
    return this.http.get<ApiResponse<FiresResponse>>(`${this.base}/fires`).pipe(map((r) => r.data));
  }

  floods(): Observable<FloodsResponse> {
    return this.http
      .get<ApiResponse<FloodsResponse>>(`${this.base}/floods`)
      .pipe(map((r) => r.data));
  }

  news(limit = 30): Observable<NewsResponse> {
    const params = new HttpParams().set('limit', limit);
    return this.http
      .get<ApiResponse<NewsResponse>>(`${this.base}/news`, { params })
      .pipe(map((r) => r.data));
  }

  flights(): Observable<FlightsResponse> {
    return this.http
      .get<ApiResponse<FlightsResponse>>(`${this.base}/flights`)
      .pipe(map((r) => r.data));
  }

  vessels(): Observable<VesselsResponse> {
    return this.http
      .get<ApiResponse<VesselsResponse>>(`${this.base}/vessels`)
      .pipe(map((r) => r.data));
  }

  traffic(): Observable<TrafficResponse> {
    return this.http
      .get<ApiResponse<TrafficResponse>>(`${this.base}/traffic`)
      .pipe(map((r) => r.data));
  }
}
