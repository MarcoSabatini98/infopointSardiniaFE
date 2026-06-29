import { Component, computed, inject, signal } from '@angular/core';
import { FeedsService } from '../../core/services/feeds.service';
import { Vessel, VesselsResponse } from '../../core/models/feeds.models';

@Component({
  selector: 'app-vessels-page',
  templateUrl: './vessels-page.html',
  styleUrl: './vessels-page.css',
})
export class VesselsPage {
  private readonly feeds = inject(FeedsService);

  protected readonly data = signal<VesselsResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly filter = signal<string>('all');

  protected readonly vessels = computed<Vessel[]>(() => {
    const d = this.data();
    if (!d) return [];
    const f = this.filter();
    return f === 'all' ? d.vessels : d.vessels.filter((v) => (v.type_label || 'sconosciuto') === f);
  });

  protected readonly typeChips = computed(() => {
    const s = this.data()?.stats?.by_type ?? {};
    return Object.entries(s)
      .sort((a, b) => b[1] - a[1])
      .map(([key, n]) => ({ key, n }));
  });

  constructor() {
    this.feeds.vessels().subscribe({
      next: (d) => this.data.set(d),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  setFilter(f: string): void {
    this.filter.set(f);
  }

  // Nodi → km/h (1 kn = 1.852 km/h).
  kmh(sog: number | null | undefined): string {
    return sog == null ? '—' : `${Math.round(sog * 1.852)} km/h`;
  }
  kn(sog: number | null | undefined): string {
    return sog == null ? '—' : `${sog} kn`;
  }
  heading(v: number | null | undefined): number {
    return v == null ? 0 : Math.round(v);
  }
}
