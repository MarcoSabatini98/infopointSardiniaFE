import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { PoiPage } from './poi-page';
import { FeedsService } from '../../core/services/feeds.service';

describe('PoiPage', () => {
  it('mostra la testata luoghi', async () => {
    await render(PoiPage, {
      providers: [
        {
          provide: FeedsService,
          useValue: {
            poi: () =>
              of({ available: true, center: { lat: 0, lng: 0 }, radius_m: 0, count: 0, items: [] }),
          },
        },
      ],
    });
    expect(screen.getByRole('heading', { name: /luoghi d'interesse/i })).toBeTruthy();
  });
});
