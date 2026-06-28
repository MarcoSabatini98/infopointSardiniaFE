import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../core/services/events.service';
import {
  CATEGORIES_BY_TYPE,
  EventItem,
  EventStatus,
  EventType,
} from '../../core/models/event.models';
import { ProvinceCode } from '../../core/models/province.models';

interface EventForm {
  uuid?: string;
  type: EventType;
  category: string;
  title: string;
  description: string;
  province_code: ProvinceCode;
  comune: string;
  start_date: string;
  end_date: string;
  status: EventStatus;
  is_free: boolean;
}

const PROVINCES: ProvinceCode[] = ['CA', 'SS', 'NU', 'OR', 'SU'];

function emptyForm(): EventForm {
  return {
    type: 'CULTURALE',
    category: 'sagra',
    title: '',
    description: '',
    province_code: 'CA',
    comune: '',
    start_date: '',
    end_date: '',
    status: 'bozza',
    is_free: true,
  };
}

@Component({
  selector: 'app-events-admin',
  imports: [DatePipe, FormsModule],
  templateUrl: './events-admin.html',
  styleUrl: './events-admin.css',
})
export class EventsAdmin {
  private readonly events = inject(EventsService);

  protected readonly provinces = PROVINCES;
  protected readonly items = signal<EventItem[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly form = signal<EventForm | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.events.list({ limit: 100 }).subscribe({
      next: (res) => {
        this.items.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  categories(): string[] {
    const f = this.form();
    return f ? CATEGORIES_BY_TYPE[f.type] : [];
  }

  // Quando cambia il tipo, riallinea la categoria a una valida per quel tipo.
  onTypeChange(): void {
    const f = this.form();
    if (f && !CATEGORIES_BY_TYPE[f.type].includes(f.category)) {
      this.form.set({ ...f, category: CATEGORIES_BY_TYPE[f.type][0] });
    }
  }

  create(): void {
    this.error.set(null);
    this.form.set(emptyForm());
  }

  edit(e: EventItem): void {
    this.error.set(null);
    this.form.set({
      uuid: e.uuid,
      type: e.type,
      category: e.category,
      title: e.title,
      description: e.description ?? '',
      province_code: e.province_code,
      comune: e.comune ?? '',
      start_date: e.start_date,
      end_date: e.end_date ?? '',
      status: e.status,
      is_free: e.is_free,
    });
  }

  cancel(): void {
    this.form.set(null);
  }

  save(): void {
    const f = this.form();
    if (!f || !f.title || !f.start_date) {
      this.error.set('Titolo e data di inizio sono obbligatori.');
      return;
    }
    this.saving.set(true);
    this.error.set(null);

    const payload: Partial<EventItem> = {
      type: f.type,
      category: f.category,
      title: f.title,
      description: f.description || null,
      province_code: f.province_code,
      comune: f.comune || null,
      start_date: f.start_date,
      end_date: f.end_date || null,
      status: f.status,
      is_free: f.is_free,
    };

    const req = f.uuid
      ? this.events.update(f.uuid, payload)
      : this.events.create(payload);

    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.form.set(null);
        this.load();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Errore nel salvataggio.');
        this.saving.set(false);
      },
    });
  }

  remove(e: EventItem): void {
    if (!confirm(`Eliminare "${e.title}"?`)) return;
    this.events.remove(e.uuid).subscribe(() => this.load());
  }
}
