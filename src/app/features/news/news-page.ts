import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FeedsService } from '../../core/services/feeds.service';
import { NewsItem } from '../../core/models/feeds.models';

@Component({
  selector: 'app-news-page',
  imports: [DatePipe],
  template: `
    <section class="container">
      <header class="ph">
        <h1>Notizie dalla Sardegna</h1>
        <p class="muted">Aggregate dalle principali testate (ANSA, L'Unione Sarda, SkyTG24).</p>
      </header>

      @if (loading()) {
        <p class="muted">Caricamento…</p>
      } @else if (items().length === 0) {
        <p class="muted state">Nessuna notizia disponibile.</p>
      } @else {
        <ul class="list">
          @for (n of items(); track n.link) {
            <li class="card row">
              <span class="src">{{ n.source }}</span>
              <div class="body">
                <a [href]="n.link" target="_blank" rel="noopener">{{ n.title }}</a>
                @if (n.summary) {
                  <p class="muted sum">{{ n.summary }}</p>
                }
                <span class="muted when">{{ n.published_at | date: 'd MMM yyyy, HH:mm' }}</span>
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
        gap: 0.9rem;
        padding: 0.85rem 1rem;
      }
      .src {
        flex: 0 0 auto;
        width: 7rem;
        font-size: var(--text-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--sea-strong);
      }
      .body {
        min-width: 0;
      }
      .body a {
        font-weight: 700;
      }
      .sum {
        margin: 0.25rem 0;
        font-size: var(--text-sm);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .when {
        font-size: var(--text-xs);
      }
      @media (max-width: 560px) {
        .row {
          flex-direction: column;
          gap: 0.3rem;
        }
        .src {
          width: auto;
        }
      }
    `,
  ],
})
export class NewsPage {
  private readonly feeds = inject(FeedsService);
  protected readonly items = signal<NewsItem[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.feeds.news(50).subscribe({
      next: (d) => this.items.set(d.items),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }
}
