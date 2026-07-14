import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { FiresPage } from './fires-page';
import { FeedsService } from '../../core/services/feeds.service';

describe('FiresPage', () => {
  it('mostra il pannello e lo stato calmo senza incendi', async () => {
    await render(FiresPage, {
      providers: [
        {
          provide: FeedsService,
          useValue: {
            fires: () =>
              of({
                available: true,
                source: 'NASA FIRMS',
                count: 0,
                fires: [],
                stats: { by_province: {}, by_severity: {}, max_frp: null },
              }),
          },
        },
      ],
    });
    expect(screen.getByRole('heading', { name: /guardia-fuochi/i })).toBeTruthy();
    expect(screen.getByText(/nessun incendio attivo/i)).toBeTruthy();
  });
});
