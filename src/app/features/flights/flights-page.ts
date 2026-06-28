import { Component, inject, signal } from '@angular/core';
import { FeedsService } from '../../core/services/feeds.service';
import { Flight } from '../../core/models/feeds.models';

@Component({
  selector: 'app-flights-page',
  template: `
    <section class="container">
      <header class="ph">
        <h1>✈️ Traffico aereo</h1>
        <p class="muted">Aerei attualmente sopra o intorno alla Sardegna (OpenSky).</p>
      </header>

      @if (loading()) {
        <p class="muted">Caricamento…</p>
      } @else if (items().length === 0) {
        <p class="muted state">Nessun aereo rilevato nell'area.</p>
      } @else {
        <p class="muted count">{{ items().length }} aerei in volo</p>
        <div class="card tablewrap">
          <table class="tbl">
            <thead>
              <tr><th>Volo</th><th>Provenienza</th><th>Quota</th><th>Velocità</th></tr>
            </thead>
            <tbody>
              @for (f of items(); track f.icao24) {
                <tr>
                  <td><strong>{{ f.callsign || f.icao24 }}</strong></td>
                  <td>{{ f.origin_country || '–' }}</td>
                  <td>{{ f.geo_altitude !== null ? round(f.geo_altitude) + ' m' : '–' }}</td>
                  <td>{{ f.velocity !== null ? round(f.velocity) + ' m/s' : '–' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .ph {
        margin-bottom: 1rem;
      }
      .ph h1 {
        font-size: var(--text-2xl);
      }
      .count {
        margin: 0 0 0.75rem;
        font-weight: 600;
      }
      .state {
        padding: 2rem 0;
      }
      .tablewrap {
        overflow-x: auto;
      }
      .tbl {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--text-sm);
      }
      .tbl th,
      .tbl td {
        text-align: left;
        padding: 0.6rem 0.9rem;
        border-bottom: 1px solid var(--line);
      }
      .tbl th {
        font-size: var(--text-xs);
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--ink-soft);
      }
      .tbl tr:last-child td {
        border-bottom: 0;
      }
    `,
  ],
})
export class FlightsPage {
  private readonly feeds = inject(FeedsService);
  protected readonly items = signal<Flight[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.feeds.flights().subscribe({
      next: (d) => this.items.set(d.flights),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  protected round(v: number) {
    return Math.round(v);
  }
}
