import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { FuelPage } from './fuel-page';
import { FeedsService } from '../../core/services/feeds.service';

describe('FuelPage', () => {
  it('mostra la testata prezzi carburante', async () => {
    await render(FuelPage, {
      providers: [
        {
          provide: FeedsService,
          useValue: {
            fuel: () =>
              of({ available: true, count: 0, stations: [], stats: { by_province: {} } }),
          },
        },
      ],
    });
    expect(screen.getByRole('heading', { name: /prezzi carburante/i })).toBeTruthy();
  });
});
