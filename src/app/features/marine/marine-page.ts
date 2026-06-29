import { Component, inject, signal } from '@angular/core';
import { FeedsService } from '../../core/services/feeds.service';
import { MarineProvince } from '../../core/models/feeds.models';
import { windDir } from '../dashboard/map-layers';

@Component({
  selector: 'app-marine-page',
  template: `
    <section class="container">
      <header class="ph">
        <h1>🌊 Mare e spiagge</h1>
        <p class="muted">Condizioni del mare lungo le coste sarde (Open-Meteo Marine).</p>
      </header>

      @if (loading()) {
        <div class="grid">
          @for (i of [1, 2, 3, 4, 5]; track i) {
            <div class="card sea"><div class="skeleton" style="height:7rem"></div></div>
          }
        </div>
      } @else {
        <div class="grid">
          @for (m of items(); track m.province.code) {
            <article class="card sea">
              <h2>{{ m.province.name }}</h2>
              <div class="big">
                <span class="wave">{{ round(m.current?.wave_height) }} m</span>
                <span class="lbl muted">altezza onde</span>
              </div>
              <dl class="rows">
                <div><dt>Mare</dt><dd>{{ round1(m.current?.sea_surface_temperature) }}°C</dd></div>
                <div><dt>Periodo onda</dt><dd>{{ round(m.current?.wave_period) }} s</dd></div>
                <div><dt>Direzione</dt><dd>{{ dir(m.current?.wave_direction) }}</dd></div>
                <div><dt>Max oggi</dt><dd>{{ round1(m.daily?.wave_height_max?.[0]) }} m</dd></div>
              </dl>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .ph {
        margin-bottom: 1.25rem;
      }
      .ph h1 {
        font-size: var(--text-2xl);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        gap: 1rem;
      }
      .sea {
        padding: 1.1rem;
      }
      .sea h2 {
        font-size: var(--text-lg);
      }
      .big {
        display: flex;
        flex-direction: column;
        margin: 0.6rem 0 0.8rem;
      }
      .wave {
        font-size: 2.4rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1;
        color: var(--sea-strong);
      }
      .lbl {
        font-size: var(--text-xs);
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .rows {
        margin: 0;
        display: grid;
        gap: 0.35rem;
      }
      .rows div {
        display: flex;
        justify-content: space-between;
        font-size: var(--text-sm);
        border-top: 1px solid var(--line);
        padding-top: 0.35rem;
      }
      .rows dt {
        color: var(--ink-soft);
      }
      .rows dd {
        margin: 0;
        font-weight: 600;
      }
    `,
  ],
})
export class MarinePage {
  private readonly feeds = inject(FeedsService);
  protected readonly items = signal<MarineProvince[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.feeds.marine().subscribe({
      next: (d) => this.items.set((Array.isArray(d) ? d : [d]) as MarineProvince[]),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  protected dir(d: number | null | undefined) {
    return windDir(d);
  }
  protected round(v: number | null | undefined) {
    return v == null ? '–' : Math.round(v);
  }
  protected round1(v: number | null | undefined) {
    return v == null ? '–' : v.toFixed(1);
  }
}
