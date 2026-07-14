import { Component, computed, inject, signal } from '@angular/core';
import { FeedsService } from '../../core/services/feeds.service';
import { Flight, FlightPhase, FlightsResponse } from '../../core/models/feeds.models';

const PHASE_ORDER: FlightPhase[] = [
  'in arrivo',
  'in partenza',
  'in avvicinamento',
  'in transito',
  'a terra',
];

@Component({
  selector: 'app-flights-page',
  templateUrl: './flights-page.html',
  styleUrl: './flights-page.css',
})
export class FlightsPage {
  private readonly feeds = inject(FeedsService);

  protected readonly data = signal<FlightsResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly filter = signal<FlightPhase | 'all'>('all');

  protected readonly flights = computed<Flight[]>(() => {
    const d = this.data();
    if (!d) return [];
    const f = this.filter();
    return f === 'all' ? d.flights : d.flights.filter((x) => x.phase === f);
  });

  protected readonly phaseChips = computed(() => {
    const s = this.data()?.stats?.by_phase ?? {};
    return PHASE_ORDER.filter((k) => s[k]).map((k) => ({ key: k, n: s[k] }));
  });

  protected readonly airlineChips = computed(() => {
    const s = this.data()?.stats?.by_airline ?? {};
    return Object.entries(s)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, n]) => ({ name, n }));
  });

  // KPI rapidi.
  protected readonly arrivi = computed(() => this.data()?.stats?.by_phase?.['in arrivo'] ?? 0);
  protected readonly partenze = computed(() => this.data()?.stats?.by_phase?.['in partenza'] ?? 0);
  protected readonly transito = computed(() => this.data()?.stats?.by_phase?.['in transito'] ?? 0);

  constructor() {
    this.feeds.flights().subscribe({
      next: (d) => this.data.set(d),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  setFilter(f: FlightPhase | 'all'): void {
    this.filter.set(f);
  }

  kmh(v: number | null | undefined): string {
    return v == null ? '—' : `${Math.round(v * 3.6)} km/h`;
  }
  alt(v: number | null | undefined): string {
    return v == null ? '—' : `${Math.round(v)} m`;
  }
  heading(v: number | null | undefined): number {
    return v == null ? 0 : Math.round(v);
  }
  vrate(v: number | null | undefined): string {
    if (v == null || Math.abs(v) < 0.5) return '→ livello';
    return v > 0 ? '↑ salita' : '↓ discesa';
  }
}
