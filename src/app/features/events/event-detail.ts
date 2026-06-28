import { Component, OnInit, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../core/services/events.service';
import { EventItem } from '../../core/models/event.models';
import { PROVINCES } from '../../core/models/province.models';

@Component({
  selector: 'app-event-detail',
  imports: [DatePipe, RouterLink],
  template: `
    <section class="container">
      <a routerLink="/eventi" class="back">← Tutti gli eventi</a>

      @if (loading()) {
        <div class="card pad"><div class="skeleton" style="height:8rem"></div></div>
      } @else if (error() || !event()) {
        <p class="muted state">Evento non trovato.</p>
      } @else if (event(); as e) {
        <article class="card detail">
          <header class="dh">
            <div class="tags">
              <span class="badge">{{ e.type === 'NATURALE' ? 'Naturale' : 'Culturale' }}</span>
              <span class="badge soft">{{ e.category }}</span>
              <span class="status" [attr.data-s]="e.status">{{ e.status }}</span>
            </div>
            <h1>{{ e.title }}</h1>
            @if (e.organizer) {
              <p class="muted org">di {{ e.organizer }}</p>
            }
          </header>

          @if (e.description) {
            <p class="desc">{{ e.description }}</p>
          }

          <dl class="meta">
            <div><dt>Provincia</dt><dd>{{ provinceName(e.province_code) }}</dd></div>
            @if (e.comune) {
              <div><dt>Comune</dt><dd>{{ e.comune }}</dd></div>
            }
            @if (e.venue) {
              <div><dt>Luogo</dt><dd>{{ e.venue }}</dd></div>
            }
            <div>
              <dt>Quando</dt>
              <dd>
                {{ e.start_date | date: 'd MMM yyyy' }}@if (e.end_date) {
                  → {{ e.end_date | date: 'd MMM yyyy' }}
                }@if (e.time) { · {{ e.time }} }
              </dd>
            </div>
            <div><dt>Ingresso</dt><dd>{{ e.is_free ? 'Gratuito' : (e.price ? e.price + ' €' : 'A pagamento') }}</dd></div>
            @if (e.contacts) {
              <div><dt>Contatti</dt><dd>{{ e.contacts }}</dd></div>
            }
            @if (e.website) {
              <div>
                <dt>Sito</dt>
                <dd><a [href]="e.website" target="_blank" rel="noopener">{{ e.website }}</a></dd>
              </div>
            }
          </dl>
        </article>
      }
    </section>
  `,
  styles: [
    `
      .back {
        display: inline-block;
        margin-bottom: 1rem;
        font-weight: 600;
        font-size: var(--text-sm);
      }
      .state {
        padding: 2rem 0;
      }
      .pad {
        padding: 1.25rem;
      }
      .detail {
        padding: 1.5rem;
        max-width: 760px;
      }
      .tags {
        display: flex;
        gap: 0.4rem;
        align-items: center;
        margin-bottom: 0.6rem;
      }
      .badge.soft {
        background: var(--surface-2);
        color: var(--ink-soft);
      }
      .dh h1 {
        font-size: var(--text-2xl);
      }
      .org {
        margin: 0.3rem 0 0;
      }
      .desc {
        margin: 1.1rem 0;
        line-height: 1.6;
        max-width: 65ch;
      }
      .meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.9rem;
        margin: 0;
        border-top: 1px solid var(--line);
        padding-top: 1.1rem;
      }
      .meta dt {
        font-size: var(--text-xs);
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--ink-soft);
      }
      .meta dd {
        margin: 0.15rem 0 0;
        font-weight: 600;
      }
      .status {
        font-size: var(--text-xs);
        font-weight: 700;
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
        text-transform: capitalize;
      }
      .status[data-s='pubblicato'] {
        background: oklch(0.92 0.06 155);
        color: var(--ok);
      }
      .status[data-s='bozza'] {
        background: var(--surface-2);
        color: var(--ink-soft);
      }
      .status[data-s='annullato'] {
        background: oklch(0.93 0.05 35);
        color: var(--danger);
      }
    `,
  ],
})
export class EventDetail implements OnInit {
  private readonly events = inject(EventsService);

  // Param di rotta legato come signal (withComponentInputBinding).
  readonly id = input.required<string>();

  protected readonly event = signal<EventItem | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  ngOnInit(): void {
    this.events.get(this.id()).subscribe({
      next: (e) => {
        this.event.set(e);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  protected provinceName(code: string): string {
    return PROVINCES.find((p) => p.code === code)?.name ?? code;
  }
}
