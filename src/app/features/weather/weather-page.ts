import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedsService } from '../../core/services/feeds.service';
import { Alert, WeatherProvince } from '../../core/models/feeds.models';
import { PROVINCES, ProvinceCode } from '../../core/models/province.models';
import { weatherInfo, windDir } from '../dashboard/map-layers';

interface HourRow {
  time: string;
  temp: number | null;
  icon: string;
  wind: number | null;
  hum: number | null;
  pop: number | null;
}
interface DayRow {
  date: string;
  icon: string;
  label: string;
  min: number | null;
  max: number | null;
  pop: number | null;
  wind: number | null;
}

@Component({
  selector: 'app-weather-page',
  imports: [DatePipe, FormsModule],
  templateUrl: './weather-page.html',
  styleUrl: './weather-page.css',
})
export class WeatherPage {
  private readonly feeds = inject(FeedsService);

  protected readonly provinces = PROVINCES;
  protected readonly summary = signal<WeatherProvince[]>([]);
  protected readonly detail = signal<WeatherProvince | null>(null);
  protected readonly alerts = signal<Alert[]>([]);
  protected readonly loadingDetail = signal(false);
  protected readonly searchError = signal<string | null>(null);
  protected query = '';

  protected readonly title = computed(() => {
    const d = this.detail();
    if (!d) return '';
    return d.location?.name || d.province?.name || d.query || 'Località';
  });

  constructor() {
    this.feeds.weather().subscribe((d) => this.summary.set((Array.isArray(d) ? d : [d]) as WeatherProvince[]));
    this.feeds.floods().subscribe((d) => this.alerts.set(d.alerts));
    // Apri sul capoluogo di Cagliari come default sensato.
    this.loadProvince('CA');
  }

  search(): void {
    const q = this.query.trim();
    if (q.length < 2) return;
    this.loadingDetail.set(true);
    this.searchError.set(null);
    this.feeds.searchWeather(q).subscribe({
      next: (d) => {
        this.detail.set(d);
        this.loadingDetail.set(false);
      },
      error: (e) => {
        this.searchError.set(e?.error?.message || 'Località non trovata');
        this.loadingDetail.set(false);
      },
    });
  }

  loadProvince(code: ProvinceCode): void {
    this.loadingDetail.set(true);
    this.searchError.set(null);
    this.feeds.weather(code).subscribe({
      next: (d) => {
        this.detail.set(d as WeatherProvince);
        this.loadingDetail.set(false);
      },
      error: () => this.loadingDetail.set(false),
    });
  }

  // ── Trasformazioni per le viste ──
  protected info(code: number | null | undefined, isDay = 1) {
    return weatherInfo(code, isDay);
  }
  protected dir(d: number | null | undefined) {
    return windDir(d);
  }
  protected round(v: number | null | undefined) {
    return v == null ? '–' : Math.round(v);
  }

  protected hours(): HourRow[] {
    const h = this.detail()?.hourly;
    if (!h?.time) return [];
    return h.time.slice(0, 24).map((time, i) => ({
      time,
      temp: h.temperature_2m?.[i] ?? null,
      icon: weatherInfo(h.weather_code?.[i], 1).icon,
      wind: h.wind_speed_10m?.[i] ?? null,
      hum: h.relative_humidity_2m?.[i] ?? null,
      pop: h.precipitation_probability?.[i] ?? null,
    }));
  }

  protected days(): DayRow[] {
    const d = this.detail()?.daily;
    if (!d?.time) return [];
    return d.time.map((date, i) => ({
      date,
      icon: weatherInfo(d.weather_code?.[i], 1).icon,
      label: weatherInfo(d.weather_code?.[i], 1).label,
      min: d.temperature_2m_min?.[i] ?? null,
      max: d.temperature_2m_max?.[i] ?? null,
      pop: d.precipitation_probability_max?.[i] ?? null,
      wind: d.wind_speed_10m_max?.[i] ?? null,
    }));
  }
}
