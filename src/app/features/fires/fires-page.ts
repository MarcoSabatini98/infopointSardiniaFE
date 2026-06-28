import { Component, computed, inject, signal } from '@angular/core';
import { FeedsService } from '../../core/services/feeds.service';
import { Fire, FiresResponse } from '../../core/models/feeds.models';
import { PROVINCES, ProvinceCode } from '../../core/models/province.models';

const SEVERITY_ORDER = ['estrema', 'alta', 'media', 'bassa', 'n/d'];

@Component({
  selector: 'app-fires-page',
  templateUrl: './fires-page.html',
  styleUrl: './fires-page.css',
})
export class FiresPage {
  private readonly feeds = inject(FeedsService);

  protected readonly data = signal<FiresResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly filter = signal<ProvinceCode | 'all'>('all');

  protected readonly provinces = PROVINCES;

  protected readonly fires = computed<Fire[]>(() => {
    const d = this.data();
    if (!d) return [];
    const f = this.filter();
    return f === 'all' ? d.fires : d.fires.filter((x) => x.province_code === f);
  });

  protected readonly severityChips = computed(() => {
    const s = this.data()?.stats?.by_severity ?? {};
    return SEVERITY_ORDER.filter((k) => s[k]).map((k) => ({ key: k, n: s[k] }));
  });

  constructor() {
    this.feeds.fires().subscribe({
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

  // FIRMS: acquired_at = "YYYY-MM-DD HHMM" → "YYYY-MM-DD HH:MM".
  fmtWhen(s: string | null): string {
    if (!s) return '—';
    return s.replace(/\s(\d{2})(\d{2})$/, ' $1:$2');
  }

  round(v: number | null | undefined): string {
    return v == null ? '—' : String(Math.round(v));
  }

  coord(v: number | null | undefined): string {
    return v == null ? '—' : v.toFixed(3);
  }

  frpText(v: number | null | undefined): string {
    return v == null ? '—' : `${Math.round(v)} MW`;
  }

  brightnessText(v: number | null | undefined): string {
    return v == null ? '—' : `${Math.round(v)} K`;
  }
}
