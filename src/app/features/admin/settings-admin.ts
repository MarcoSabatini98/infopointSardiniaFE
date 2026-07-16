import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';

interface Row {
  key: string;
  description: string;
  valueText: string;
  saving: boolean;
  error: string | null;
  ok: boolean;
}

@Component({
  selector: 'app-settings-admin',
  imports: [FormsModule],
  template: `
    <section class="container">
      <header class="ph">
        <h1>Impostazioni</h1>
        <p class="muted">Configurazione della dashboard (valori in formato JSON).</p>
      </header>

      @if (loading()) {
        <p class="muted loading"><span class="spinner" aria-hidden="true"></span>Caricamento in corso…</p>
      } @else {
        <div class="list">
          @for (r of rows(); track r.key) {
            <article class="card row">
              <div class="rh">
                <code class="key">{{ r.key }}</code>
                @if (r.ok) { <span class="saved">salvato ✓</span> }
              </div>
              @if (r.description) { <p class="muted desc">{{ r.description }}</p> }
              <textarea class="textarea" rows="3" [(ngModel)]="r.valueText"></textarea>
              @if (r.error) { <p class="err">{{ r.error }}</p> }
              <div class="actions">
                <button class="btn btn-primary" type="button" [disabled]="r.saving" (click)="save(r)">
                  {{ r.saving ? 'Salvataggio…' : 'Salva' }}
                </button>
              </div>
            </article>
          }
        </div>

        <article class="card row new">
          <h2>Nuova impostazione</h2>
          <input class="input" placeholder="chiave (es. map.default_layer)" [(ngModel)]="newKey" />
          <textarea class="textarea" rows="3" placeholder='valore JSON (es. "weather")' [(ngModel)]="newValue"></textarea>
          @if (newError()) { <p class="err">{{ newError() }}</p> }
          <div class="actions">
            <button class="btn btn-primary" type="button" [disabled]="creating()" (click)="create()">
              {{ creating() ? 'Creazione…' : 'Crea' }}
            </button>
          </div>
        </article>
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
      .list {
        display: grid;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .row {
        padding: 1rem 1.1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .rh {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .key {
        font-weight: 700;
        background: var(--surface-2);
        padding: 0.15rem 0.5rem;
        border-radius: 6px;
      }
      .saved {
        font-size: var(--text-xs);
        font-weight: 700;
        color: var(--ok);
      }
      .desc {
        margin: 0;
        font-size: var(--text-sm);
      }
      .textarea {
        font-family: ui-monospace, monospace;
        font-size: var(--text-sm);
      }
      .err {
        color: var(--danger);
        font-weight: 600;
        margin: 0;
        font-size: var(--text-sm);
      }
      .actions {
        display: flex;
        justify-content: flex-end;
      }
      .new h2 {
        font-size: var(--text-lg);
      }
    `,
  ],
})
export class SettingsAdmin {
  private readonly settings = inject(SettingsService);

  protected readonly rows = signal<Row[]>([]);
  protected readonly loading = signal(true);
  protected newKey = '';
  protected newValue = '';
  protected readonly newError = signal<string | null>(null);
  protected readonly creating = signal(false);

  constructor() {
    this.settings.list().subscribe({
      next: (list) =>
        this.rows.set(
          list.map((s) => ({
            key: s.key,
            description: s.description ?? '',
            valueText: JSON.stringify(s.value, null, 2),
            saving: false,
            error: null,
            ok: false,
          })),
        ),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  save(r: Row): void {
    let value: unknown;
    try {
      value = JSON.parse(r.valueText);
    } catch {
      r.error = 'JSON non valido';
      return;
    }
    r.error = null;
    r.ok = false;
    r.saving = true;
    this.settings.upsert(r.key, value, r.description || undefined).subscribe({
      next: () => {
        r.saving = false;
        r.ok = true;
      },
      error: (e) => {
        r.saving = false;
        r.error = e?.error?.message || 'Errore nel salvataggio';
      },
    });
  }

  create(): void {
    if (!this.newKey.trim()) {
      this.newError.set('La chiave è obbligatoria');
      return;
    }
    let value: unknown;
    try {
      value = JSON.parse(this.newValue);
    } catch {
      this.newError.set('Valore JSON non valido');
      return;
    }
    this.newError.set(null);
    this.creating.set(true);
    this.settings.upsert(this.newKey.trim(), value).subscribe({
      next: (s) => {
        this.rows.update((rows) => [
          ...rows,
          {
            key: s.key,
            description: s.description ?? '',
            valueText: JSON.stringify(s.value, null, 2),
            saving: false,
            error: null,
            ok: true,
          },
        ]);
        this.newKey = '';
        this.newValue = '';
        this.creating.set(false);
      },
      error: (e) => {
        this.creating.set(false);
        this.newError.set(e?.error?.message || 'Errore nella creazione');
      },
    });
  }
}
