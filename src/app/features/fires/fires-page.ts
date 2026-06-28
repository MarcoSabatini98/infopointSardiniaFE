import { Component, inject, signal } from '@angular/core';
import { FeedsService } from '../../core/services/feeds.service';
import { Fire } from '../../core/models/feeds.models';

@Component({
  selector: 'app-fires-page',
  template: `
    <section class="container">
      <header class="ph">
        <h1>🔥 Incendi attivi</h1>
        <p class="muted">Hotspot satellitari rilevati nelle ultime ore (EFFIS / NASA FIRMS).</p>
      </header>

      @if (loading()) {
        <p class="muted">Caricamento…</p>
      } @else if (items().length === 0) {
        <p class="muted state">Nessun incendio attivo rilevato in Sardegna.</p>
      } @else {
        <p class="muted count">{{ items().length }} focolai rilevati</p>
        <ul class="list">
          @for (f of items(); track f.id) {
            <li class="card row">
              <span class="ic">🔥</span>
              <div class="body">
                <strong>Focolaio · {{ f.source }}</strong>
                <span class="muted">
                  {{ f.lat }}, {{ f.lng }}@if (f.acquired_at) { · {{ f.acquired_at }} }
                  @if (f.confidence !== null) { · conf. {{ f.confidence }} }
                </span>
              </div>
            </li>
          }
        </ul>
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
      .list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.6rem;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 0.7rem 0.9rem;
      }
      .row .ic {
        font-size: 1.3rem;
      }
      .body {
        display: flex;
        flex-direction: column;
      }
      .body .muted {
        font-size: var(--text-sm);
      }
    `,
  ],
})
export class FiresPage {
  private readonly feeds = inject(FeedsService);
  protected readonly items = signal<Fire[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.feeds.fires().subscribe({
      next: (d) => this.items.set(d.fires),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }
}
