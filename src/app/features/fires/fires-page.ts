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

  protected readonly windowDays = computed(() => this.data()?.window_days ?? null);

  // Storico per giorno (barre): dal più vecchio al più recente, così la striscia
  // "si allunga" verso oggi. pct = altezza barra relativa al giorno di picco.
  protected readonly days = computed(() => {
    const byDay = this.data()?.stats?.by_day ?? {};
    const entries = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b));
    const max = Math.max(1, ...entries.map(([, n]) => n));
    return entries.map(([day, n]) => ({ day, n, pct: Math.round((n / max) * 100) }));
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

  // acquired_at è un timestamp ISO (o data sola): formattato in ora locale.
  fmtWhen(s: string | null | undefined): string {
    if (!s) return '—';
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleString('it-IT', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Giorno breve per lo storico (es. "lun 14").
  fmtDay(day: string): string {
    const d = new Date(`${day}T00:00:00`);
    if (isNaN(d.getTime())) return day;
    return d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' });
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
