import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { MarinePage } from './marine-page';
import { FeedsService } from '../../core/services/feeds.service';

describe('MarinePage', () => {
  it('mostra la testata mare', async () => {
    await render(MarinePage, {
      providers: [{ provide: FeedsService, useValue: { marine: () => of([]) } }],
    });
    expect(screen.getByRole('heading', { name: /mare e spiagge/i })).toBeTruthy();
  });
});
