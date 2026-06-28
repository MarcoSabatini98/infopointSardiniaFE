import { Component, inject, signal } from '@angular/core';
import { FeedsService } from '../../core/services/feeds.service';
import { TrafficIncident } from '../../core/models/feeds.models';

@Component({
  selector: 'app-traffic-page',
  template: `
    <section class="container">
      <header class="ph">
        <h1>🚧 Traffico stradale</h1>
        <p class="muted">Incidenti, cantieri e code sulle strade sarde (TomTom).</p>
      </header>

      @if (loading()) {
        <p class="muted">Caricamento…</p>
      } @else if (items().length === 0) {
        <p class="muted state">Nessun evento di traffico segnalato.</p>
      } @else {
        <p class="muted count">{{ items().length }} segnalazioni</p>
        <ul class="list">
          @for (i of items(); track i.id) {
            <li class="card row">
              <span class="cat">{{ i.category }}</span>
              <div class="body">
                <strong>{{ i.description || i.category }}</strong>
                <span class="muted">
                  @if (i.road_numbers?.length) { {{ i.road_numbers!.join(', ') }} }
                  @if (i.from) { · da {{ i.from }} }@if (i.to) { → {{ i.to }} }
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
      .cat {
        flex: 0 0 auto;
        font-size: var(--text-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--traffic);
        background: oklch(0.95 0.05 75);
        padding: 0.2rem 0.5rem;
        border-radius: 999px;
      }
      .body {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .body .muted {
        font-size: var(--text-sm);
      }
    `,
  ],
})
export class TrafficPage {
  private readonly feeds = inject(FeedsService);
  protected readonly items = signal<TrafficIncident[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.feeds.traffic().subscribe({
      next: (d) => this.items.set(d.incidents),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }
}
