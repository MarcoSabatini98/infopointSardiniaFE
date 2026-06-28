import { Component, inject, signal } from '@angular/core';
import { FeedsService } from '../../core/services/feeds.service';
import { WeatherProvince } from '../../core/models/feeds.models';
import { weatherInfo, windDir } from '../dashboard/map-layers';

@Component({
  selector: 'app-weather-page',
  template: `
    <section class="container">
      <header class="ph">
        <h1>Meteo Sardegna</h1>
        <p class="muted">Condizioni attuali e previsione del giorno per le cinque province.</p>
      </header>

      @if (loading()) {
        <div class="grid">
          @for (i of [1, 2, 3, 4, 5]; track i) {
            <div class="card wx"><div class="skeleton" style="height:9rem"></div></div>
          }
        </div>
      } @else {
        <div class="grid">
          @for (w of items(); track w.province.code) {
            <article class="card wx">
              <div class="wx-head">
                <h2>{{ w.province.name }}</h2>
                <span class="big-ic">{{ info(w).icon }}</span>
              </div>
              <p class="cond muted">{{ info(w).label }}</p>
              <div class="temp">{{ round(w.current?.temperature_2m) }}°</div>
              <p class="muted perc">Percepita {{ round(w.current?.apparent_temperature) }}°</p>
              <dl class="rows">
                <div><dt>Umidità</dt><dd>{{ round(w.current?.relative_humidity_2m) }}%</dd></div>
                <div>
                  <dt>Vento</dt>
                  <dd>{{ round(w.current?.wind_speed_10m) }} km/h {{ dir(w.current?.wind_direction_10m) }}</dd>
                </div>
                <div><dt>Precip.</dt><dd>{{ w.current?.precipitation ?? 0 }} mm</dd></div>
                <div><dt>Oggi</dt><dd>{{ min(w) }}° / {{ max(w) }}°</dd></div>
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
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1rem;
      }
      .wx {
        padding: 1.1rem;
      }
      .wx-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .wx-head h2 {
        font-size: var(--text-lg);
      }
      .big-ic {
        font-size: 2rem;
        line-height: 1;
      }
      .cond {
        font-size: var(--text-sm);
        margin: 0.1rem 0 0.4rem;
      }
      .temp {
        font-size: 2.6rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1;
      }
      .perc {
        font-size: var(--text-sm);
        margin: 0.2rem 0 0.8rem;
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
export class WeatherPage {
  private readonly feeds = inject(FeedsService);
  protected readonly items = signal<WeatherProvince[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.feeds.weather().subscribe({
      next: (d) => this.items.set((Array.isArray(d) ? d : [d]) as WeatherProvince[]),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  protected info(w: WeatherProvince) {
    return weatherInfo(w.current?.weather_code, w.current?.is_day);
  }
  protected dir(d: number | null | undefined) {
    return windDir(d);
  }
  protected round(v: number | null | undefined) {
    return v == null ? '–' : Math.round(v);
  }
  protected min(w: WeatherProvince) {
    return this.round(w.daily?.temperature_2m_min?.[0]);
  }
  protected max(w: WeatherProvince) {
    return this.round(w.daily?.temperature_2m_max?.[0]);
  }
}
