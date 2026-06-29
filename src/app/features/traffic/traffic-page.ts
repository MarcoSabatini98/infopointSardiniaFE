import { Component, computed, inject, signal } from '@angular/core';
import { FeedsService } from '../../core/services/feeds.service';
import { TrafficIncident, TrafficResponse } from '../../core/models/feeds.models';
import { PROVINCES, ProvinceCode } from '../../core/models/province.models';

const SEVERITY_ORDER = ['chiusura', 'grave', 'moderata', 'lieve', 'n/d'];

@Component({
  selector: 'app-traffic-page',
  templateUrl: './traffic-page.html',
  styleUrl: './traffic-page.css',
})
export class TrafficPage {
  private readonly feeds = inject(FeedsService);

  protected readonly data = signal<TrafficResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly filter = signal<ProvinceCode | 'all'>('all');
  protected readonly provinces = PROVINCES;

  protected readonly incidents = computed<TrafficIncident[]>(() => {
    const d = this.data();
    if (!d) return [];
    const f = this.filter();
    return f === 'all' ? d.incidents : d.incidents.filter((i) => i.province_code === f);
  });

  protected readonly severityChips = computed(() => {
    const s = this.data()?.stats?.by_severity ?? {};
    return SEVERITY_ORDER.filter((k) => s[k]).map((k) => ({ key: k, n: s[k] }));
  });

  constructor() {
    this.feeds.traffic().subscribe({
      next: (d) => this.data.set(d),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  setFilter(f: ProvinceCode | 'all'): void {
    this.filter.set(f);
  }

  provinceCount(code: ProvinceCode): number {
    return this.data()?.stats?.by_province?.[code] ?? 0;
  }

  provinceName(code: string | null | undefined): string {
    return PROVINCES.find((p) => p.code === code)?.name ?? '—';
  }

  delayText(s: number | null | undefined): string {
    if (s == null || s <= 0) return '—';
    const m = Math.round(s / 60);
    return m >= 1 ? `+${m} min` : `+${s}s`;
  }

  lengthText(m: number | null | undefined): string {
    if (m == null) return '—';
    return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
  }

  tratto(i: TrafficIncident): string {
    if (i.from && i.to) return `${i.from} → ${i.to}`;
    return i.from || i.to || '—';
  }
}
