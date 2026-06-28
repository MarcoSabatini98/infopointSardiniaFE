import { Component, inject, signal } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { ExternalEvent } from '../../core/models/event.models';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsList {
  private readonly events = inject(EventsService);

  protected readonly items = signal<ExternalEvent[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  constructor() {
    this.events.externalList().subscribe({
      next: (list) => {
        this.items.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
