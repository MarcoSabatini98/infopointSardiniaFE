import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { VesselsPage } from './vessels-page';
import { FeedsService } from '../../core/services/feeds.service';

describe('VesselsPage', () => {
  it('mostra la testata traffico marittimo', async () => {
    await render(VesselsPage, {
      providers: [
        {
          provide: FeedsService,
          useValue: {
            vessels: () => of({ available: true, count: 0, vessels: [], stats: { by_type: {} } }),
          },
        },
      ],
    });
    expect(screen.getByRole('heading', { name: /traffico marittimo/i })).toBeTruthy();
  });
});
