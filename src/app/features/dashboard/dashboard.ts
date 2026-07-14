import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SardiniaMap } from './sardinia-map';
import { FeedsService } from '../../core/services/feeds.service';
import { MapService, ProvinceInfo } from '../../core/services/map.service';
import { ProvinceCode, PROVINCES } from '../../core/models/province.models';
import { Alert, NewsItem, WeatherProvince } from '../../core/models/feeds.models';
import { MapEvent } from '../../core/models/event.models';
import { GeoLayer, LAYERS } from './map-layers';

@Component({
  selector: 'app-dashboard',
  imports: [SardiniaMap, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly feeds = inject(FeedsService);
  private readonly mapService = inject(MapService);

  protected readonly provincesList = PROVINCES;

  protected readonly news = signal<NewsItem[]>([]);
  protected readonly alerts = signal<Alert[]>([]);
  protected readonly newsLoading = signal(true);
  protected readonly alertsLoading = signal(true);

  // Provincia attiva (null = vista Globale). Pilota mappa + pannello.
  protected readonly activeProvince = signal<ProvinceCode | null>(null);
  protected readonly province = signal<ProvinceInfo | null>(null);
  protected readonly loadingProvince = signal(false);

  // Selettore layer mappa.
  protected readonly layers = LAYERS;
  protected readonly activeLayer = signal<GeoLayer>('weather');
  protected readonly layerCount = signal<number | null>(null);
  protected readonly layerLoading = signal(false);

  protected readonly featured = computed(() => this.news()[0] ?? null);
  protected readonly restNews = computed(() => this.news().slice(1));

  // News che citano la provincia attiva (filtro testuale su titolo+sommario).
  protected readonly provinceNews = computed(() => {
    const code = this.activeProvince();
    if (!code) return [];
    const p = PROVINCES.find((x) => x.code === code);
    if (!p) return [];
    const terms = [p.name, p.capoluogo].map((t) => t.toLowerCase());
    return this.news().filter((n) => {
      const hay = `${n.title ?? ''} ${n.summary ?? ''}`.toLowerCase();
      return terms.some((t) => hay.includes(t));
    });
  });

  constructor() {
    this.feeds.news(20).subscribe({
      next: (d) => this.news.set(d.items),
      complete: () => this.newsLoading.set(false),
    });
    this.feeds.floods().subscribe({
      next: (d) => this.alerts.set(d.alerts),
      complete: () => this.alertsLoading.set(false),
    });
  }

  // Toggle provincia: stessa provincia → deseleziona (torna Globale).
  selectProvince(code: ProvinceCode): void {
    if (this.activeProvince() === code) {
      this.clearProvince();
      return;
    }
    this.activeProvince.set(code);
    this.loadingProvince.set(true);
    this.province.set(null);
    this.mapService.provinceInfo(code).subscribe({
      next: (info) => {
        this.province.set(info);
        this.loadingProvince.set(false);
      },
      error: () => this.loadingProvince.set(false),
    });
  }

  clearProvince(): void {
    this.activeProvince.set(null);
    this.province.set(null);
  }

  setLayer(id: GeoLayer): void {
    this.activeLayer.set(id);
  }

  onLayerStats(e: { count: number | null; loading: boolean }): void {
    this.layerCount.set(e.count);
    this.layerLoading.set(e.loading);
  }

  protected provinceTemp(): number | null {
    const w = this.province()?.weather as WeatherProvince | null | undefined;
    return w?.current?.temperature_2m ?? null;
  }

  protected provinceEvents(): MapEvent[] {
    return this.province()?.events.items ?? [];
  }

  protected provinceAlerts(): Alert[] {
    return (this.province()?.alerts.items ?? []) as Alert[];
  }

  protected sourceColor(source: string): string {
    if (source === 'ANSA Sardegna') return 'var(--sea)';
    if (source === 'SkyTG24') return 'var(--flights)';
    return 'var(--news)';
  }
}
