import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SardiniaMap } from './sardinia-map';
import { FeedsService } from '../../core/services/feeds.service';
import { MapService, ProvinceInfo } from '../../core/services/map.service';
import { ProvinceCode } from '../../core/models/province.models';
import { Alert, NewsItem, WeatherProvince } from '../../core/models/feeds.models';
import { EventItem } from '../../core/models/event.models';
import { GeoLayer, LAYERS } from './map-layers';

type PanelView = 'global' | 'province';

@Component({
  selector: 'app-dashboard',
  imports: [SardiniaMap, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly feeds = inject(FeedsService);
  private readonly mapService = inject(MapService);

  protected readonly news = signal<NewsItem[]>([]);
  protected readonly alerts = signal<Alert[]>([]);
  protected readonly newsLoading = signal(true);
  protected readonly alertsLoading = signal(true);
  protected readonly province = signal<ProvinceInfo | null>(null);
  protected readonly loadingProvince = signal(false);
  protected readonly view = signal<PanelView>('global');

  // Selettore layer mappa (fuori dalla mappa).
  protected readonly layers = LAYERS;
  protected readonly activeLayer = signal<GeoLayer>('weather');
  protected readonly layerCount = signal<number | null>(null);
  protected readonly layerLoading = signal(false);

  // Prima notizia "in evidenza", il resto in lista.
  protected readonly featured = computed(() => this.news()[0] ?? null);
  protected readonly restNews = computed(() => this.news().slice(1));

  constructor() {
    this.feeds.news(14).subscribe({
      next: (d) => this.news.set(d.items),
      complete: () => this.newsLoading.set(false),
    });
    this.feeds.floods().subscribe({
      next: (d) => this.alerts.set(d.alerts),
      complete: () => this.alertsLoading.set(false),
    });
  }

  onProvince(code: ProvinceCode): void {
    this.loadingProvince.set(true);
    this.view.set('province');
    this.mapService.provinceInfo(code).subscribe({
      next: (info) => {
        this.province.set(info);
        this.loadingProvince.set(false);
      },
      error: () => this.loadingProvince.set(false),
    });
  }

  setView(v: PanelView): void {
    this.view.set(v);
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

  protected provinceEvents(): EventItem[] {
    return (this.province()?.events.items ?? []) as EventItem[];
  }

  protected provinceAlerts(): Alert[] {
    return (this.province()?.alerts.items ?? []) as Alert[];
  }

  // Colore del pallino-sorgente per testata.
  protected sourceColor(source: string): string {
    if (source === 'ANSA Sardegna') return 'var(--sea)';
    if (source === 'SkyTG24') return 'var(--flights)';
    return 'var(--news)';
  }
}
