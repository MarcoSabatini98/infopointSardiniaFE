import { Component, OnInit, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../core/services/events.service';
import { EventItem } from '../../core/models/event.models';
import { PROVINCES } from '../../core/models/province.models';

@Component({
  selector: 'app-event-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
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
