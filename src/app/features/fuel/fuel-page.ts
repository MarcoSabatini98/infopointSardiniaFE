import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeedsService } from '../../core/services/feeds.service';
import { FuelResponse, FuelStation } from '../../core/models/feeds.models';
import { PROVINCES, ProvinceCode } from '../../core/models/province.models';

@Component({
  selector: 'app-fuel-page',
  imports: [FormsModule],
  templateUrl: './fuel-page.html',
  styleUrl: './fuel-page.css',
})
export class FuelPage {
  private readonly feeds = inject(FeedsService);

  protected readonly data = signal<FuelResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly province = signal<ProvinceCode | 'all'>('all');
  protected fuelType = 'Benzina';
  protected comuneQuery = '';
  protected readonly comuneSig = signal('');

  protected readonly provinces = PROVINCES;

  // Tipi carburante più comuni presenti nei dati.
  protected readonly fuelTypes = computed(() => {
    const set = new Set<string>();
    for (const s of this.data()?.stations ?? []) {
      for (const f of s.fuels) set.add(f.type);
    }
    const common = ['Benzina', 'Gasolio', 'GPL', 'Metano'];
    return [...common.filter((c) => set.has(c)), ...[...set].filter((t) => !common.includes(t))];
  });

  protected readonly stations = computed<FuelStation[]>(() => {
    const d = this.data();
    if (!d) return [];
    const prov = this.province();
    const q = this.comuneSig().trim().toLowerCase();
    const ft = this.fuelType;
    let list = d.stations.filter((s) => {
      if (prov !== 'all' && s.province_code !== prov) return false;
      if (q && !(s.comune || '').toLowerCase().includes(q)) return false;
      if (ft && !s.fuels.some((f) => f.type === ft)) return false;
      return true;
    });
    // Ordina per prezzo del carburante selezionato (più economico in cima).
    if (ft) {
      list = [...list].sort((a, b) => (this.priceOf(a, ft) ?? 1e9) - (this.priceOf(b, ft) ?? 1e9));
    }
    return list.slice(0, 200);
  });

  constructor() {
    this.feeds.fuel().subscribe({
      next: (d) => this.data.set(d),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  setProvince(p: ProvinceCode | 'all'): void {
    this.province.set(p);
  }
  onComune(): void {
    this.comuneSig.set(this.comuneQuery);
  }

  priceOf(s: FuelStation, type: string): number | null {
    const matches = s.fuels.filter((f) => f.type === type).map((f) => f.price);
    return matches.length ? Math.min(...matches) : null;
  }
  priceText(s: FuelStation, type: string): string {
    const p = this.priceOf(s, type);
    return p == null ? '—' : `${p.toFixed(3)} €`;
  }
}
