import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { FlightsPage } from './flights-page';
import { FeedsService } from '../../core/services/feeds.service';

describe('FlightsPage', () => {
  it('mostra il radar voli', async () => {
    await render(FlightsPage, {
      providers: [
        {
          provide: FeedsService,
          useValue: {
            flights: () =>
              of({
                available: true,
                count: 0,
                flights: [],
                stats: { by_airline: {}, by_phase: {} },
              }),
          },
        },
      ],
    });
    expect(screen.getByRole('heading', { name: /radar voli/i })).toBeTruthy();
  });
});
