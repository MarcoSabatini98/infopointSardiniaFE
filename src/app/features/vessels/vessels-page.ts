import { Component, inject, signal } from '@angular/core';
import { FeedsService } from '../../core/services/feeds.service';
import { Vessel } from '../../core/models/feeds.models';

@Component({
  selector: 'app-vessels-page',
  template: `
    <section class="container">
      <header class="ph">
        <h1>⛴️ Traffico marittimo</h1>
        <p class="muted">Navi con posizione AIS recente intorno alla Sardegna (aisstream).</p>
      </header>

      @if (loading()) {
        <p class="muted">Caricamento…</p>
      } @else if (items().length === 0) {
        <p class="muted state">Nessuna nave rilevata al momento.</p>
      } @else {
        <p class="muted count">{{ items().length }} navi</p>
        <div class="card tablewrap">
          <table class="tbl">
            <thead>
              <tr><th>Nave</th><th>MMSI</th><th>Velocità</th><th>Rotta</th></tr>
            </thead>
            <tbody>
              @for (v of items(); track v.mmsi) {
                <tr>
                  <td><strong>{{ v.name || '—' }}</strong></td>
                  <td>{{ v.mmsi }}</td>
                  <td>{{ v.sog !== null ? v.sog + ' kn' : '–' }}</td>
                  <td>{{ v.heading !== null ? v.heading + '°' : '–' }}</td>
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
export class VesselsPage {
  private readonly feeds = inject(FeedsService);
  protected readonly items = signal<Vessel[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.feeds.vessels().subscribe({
      next: (d) => this.items.set(d.vessels),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }
}
