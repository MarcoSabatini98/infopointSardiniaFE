import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { EventDetail } from './event-detail';
import { EventsService } from '../../core/services/events.service';

const event = {
  uuid: 'e1',
  type: 'CULTURALE',
  category: 'sagra',
  title: 'Sagra del Pane',
  description: 'Festa di paese',
  province_code: 'NU',
  comune: 'Orgosolo',
  start_date: '2026-07-12',
  is_free: true,
  status: 'pubblicato',
};

describe('EventDetail', () => {
  it('carica e mostra il dettaglio evento', async () => {
    await render(EventDetail, {
      inputs: { id: 'e1' },
      providers: [provideRouter([]), { provide: EventsService, useValue: { get: () => of(event) } }],
    });
    expect(await screen.findByRole('heading', { name: /sagra del pane/i })).toBeTruthy();
    expect(screen.getByText(/orgosolo/i)).toBeTruthy();
  });
});
