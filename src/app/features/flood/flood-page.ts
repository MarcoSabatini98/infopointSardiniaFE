import { Component, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FeedsService } from '../../core/services/feeds.service';
import { FloodResponse } from '../../core/models/feeds.models';
import { PROVINCES, ProvinceCode } from '../../core/models/province.models';

interface FloodCard {
  code: ProvinceCode;
  name: string;
  data: FloodResponse;
}

@Component({
  selector: 'app-flood-page',
  templateUrl: './flood-page.html',
  styleUrl: './flood-page.css',
})
export class FloodPage {
  private readonly feeds = inject(FeedsService);
  protected readonly items = signal<FloodCard[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    // Il BE serve una provincia per richiesta: aggreghiamo le 5 in parallelo.
    forkJoin(PROVINCES.map((p) => this.feeds.flood(p.code))).subscribe({
      next: (res) =>
        this.items.set(PROVINCES.map((p, i) => ({ code: p.code, name: p.name, data: res[i] }))),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  protected num(v: number | null | undefined) {
    return v == null ? '–' : v.toFixed(2);
  }
  // Altezza barra: valore del giorno in % rispetto al picco 7 giorni.
  protected barH(v: number | null | undefined, max: number | null | undefined) {
    if (v == null || !max) return 2;
    return Math.max(4, Math.round((v / max) * 100));
  }
}
